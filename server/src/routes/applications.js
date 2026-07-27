import { Router } from "express";
import multer from "multer";
import { fileTypeFromBuffer } from "file-type";
import { v4 as uuidv4 } from "uuid";
import fs from "node:fs";
import path from "node:path";
import { db } from "../db/connection.js";
import { applicationLimiter } from "../middleware/rateLimit.js";
import { sendApplicationConfirmation, sendApplicationNotification } from "../utils/mailer.js";
import { env } from "../config/env.js";

const router = Router();

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const UPLOAD_ROOT = env.uploadRoot;
const CV_DIR = path.join(UPLOAD_ROOT, "cvs");
fs.mkdirSync(CV_DIR, { recursive: true });

// CV upload — public-facing, so treated as fully untrusted input:
//   - memory storage only (never trust a raw upload straight to disk)
//   - 5 MB hard ceiling, one file
//   - fileFilter is a cheap first-pass reject on obviously-wrong types;
//     the real check is the magic-byte verification below, since a
//     client-supplied extension/MIME is trivially spoofable
const CV_MAX_BYTES = 5 * 1024 * 1024;
const cvUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: CV_MAX_BYTES, files: 1 },
  fileFilter: (req, file, cb) => {
    const okExt = /\.pdf$/i.test(file.originalname || "");
    const okMime = file.mimetype === "application/pdf";
    if (!okExt || !okMime) return cb(new Error("CV_WRONG_TYPE"));
    cb(null, true);
  },
});

function bad(res, msg) {
  return res.status(400).json({ error: msg });
}

router.post("/", applicationLimiter, (req, res, next) => {
  cvUpload.single("cv")(req, res, (err) => {
    if (err) {
      if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(413).json({ error: `CV must be under ${Math.round(CV_MAX_BYTES / 1024 / 1024)} MB.` });
      }
      if (err.message === "CV_WRONG_TYPE") {
        return res.status(415).json({ error: "CV must be a PDF file." });
      }
      return next(err);
    }
    next();
  });
}, async (req, res) => {
  // Honeypot — same pattern as the booking form.
  if (req.body["bot-field"]) {
    return res.status(200).json({ ok: true });
  }

  const name    = String(req.body.name    || "").trim().slice(0, 200);
  const email   = String(req.body.email   || "").trim().slice(0, 254).toLowerCase();
  const phone   = String(req.body.phone   || "").trim().slice(0, 50);
  const message = String(req.body.message || "").trim().slice(0, 4000);
  const jobId   = req.body.jobId != null && req.body.jobId !== "" ? Number(req.body.jobId) : null;
  const jobTitle = String(req.body.jobTitle || "").trim().slice(0, 200);

  if (!name)                 return bad(res, "Name is required.");
  if (!EMAIL_RE.test(email)) return bad(res, "A valid email address is required.");
  if (!phone)                return bad(res, "Phone number is required.");
  if (!/\d{7}/.test(phone.replace(/\D/g, "")))
                              return bad(res, "Please enter a valid phone number.");
  if (!message)               return bad(res, "Please tell us a little about yourself.");
  if (jobId != null && (!Number.isInteger(jobId) || jobId < 1))
                              return bad(res, "Invalid job reference.");

  // ── CV: verify real content, not just the filename/claimed MIME ──────────
  let cvPath = null;
  let cvBuffer = null;
  let cvFilename = null;
  if (req.file) {
    const kind = await fileTypeFromBuffer(req.file.buffer);
    if (!kind || kind.mime !== "application/pdf") {
      return res.status(415).json({ error: "That file isn't a valid PDF. Please attach a real PDF document." });
    }
    const safeName = `${uuidv4()}.pdf`;
    const fullPath = path.resolve(CV_DIR, safeName);
    // Path traversal guard, same convention as the image upload pipeline.
    if (!fullPath.startsWith(CV_DIR + path.sep)) {
      return res.status(400).json({ error: "Invalid destination path" });
    }
    fs.writeFileSync(fullPath, req.file.buffer);
    cvPath = `/uploads/cvs/${safeName}`;
    cvBuffer = req.file.buffer;
    cvFilename = `CV - ${name}.pdf`;
  }

  const ip = req.ip ?? req.socket?.remoteAddress ?? null;

  let applicationId;
  try {
    const stmt = db.prepare(`
      INSERT INTO applications (job_id, job_title, name, email, phone, message, cv_path, ip)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);
    const result = stmt.run(jobId, jobTitle || null, name, email, phone, message, cvPath, ip);
    applicationId = result.lastInsertRowid;
  } catch (err) {
    console.error("[applications] DB insert failed:", err);
    return res.status(500).json({ error: "Could not save your application. Please try again or contact us directly." });
  }

  const application = { id: applicationId, jobId, jobTitle, name, email, phone, message, cvPath, ip, created_at: Math.floor(Date.now() / 1000) };
  let emailSent = false;

  try {
    const tasks = [
      sendApplicationConfirmation(application),
      // Only the internal notification gets the CV attached — no reason to
      // mail the applicant's own file back to them.
      env.notifyEmail
        ? sendApplicationNotification(application, cvBuffer ? { filename: cvFilename, content: cvBuffer } : null)
        : null,
    ].filter(Boolean);
    await Promise.all(tasks);
    emailSent = true;
    db.prepare("UPDATE applications SET email_sent = 1 WHERE id = ?").run(applicationId);
  } catch (err) {
    console.error(`[applications] Email send failed for application #${applicationId}:`, err.message);
  }

  return res.status(200).json({
    ok: true,
    message: emailSent
      ? "Your application has been received. A confirmation has been sent to your email."
      : "Your application has been received. Our team will be in touch shortly.",
  });
});

export default router;
