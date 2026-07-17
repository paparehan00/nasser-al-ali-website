import { Router } from "express";
import multer from "multer";
import sharp from "sharp";
import { fileTypeFromBuffer } from "file-type";
import { v4 as uuidv4 } from "uuid";
import fs from "node:fs";
import path from "node:path";
import rateLimit from "express-rate-limit";

import { requireAuth, requireFreshPassword } from "../middleware/auth.js";
import { requireCsrf } from "../middleware/csrf.js";
import { audit } from "../utils/audit.js";
import { policyFor } from "../config/uploadPolicies.js";
import { env } from "../config/env.js";

const UPLOAD_ROOT = env.uploadRoot;
fs.mkdirSync(UPLOAD_ROOT, { recursive: true });

const KEY_RE = /^[a-z][a-z0-9_-]{0,63}$/;

// --- multer: memory buffer only (never write raw upload to disk) ---
const RAW_MAX_BYTES = 12 * 1024 * 1024; // 12 MB raw ceiling before we even decode
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: RAW_MAX_BYTES, files: 1 },
  fileFilter: (req, file, cb) => {
    // MIME is client-supplied and untrustworthy — real content check is done
    // by fileTypeFromBuffer below. Here we only reject SVG explicitly (SVG
    // has no reliable magic bytes and can carry active script content). All
    // other types fall through and get real-content validated.
    if (/^image\/svg/i.test(file.mimetype) || /\.svgz?$/i.test(file.originalname)) {
      return cb(new Error("Unsupported file type"));
    }
    cb(null, true);
  },
});

// Real-content type check.
const ALLOWED_KINDS = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);

// Per-user upload throttling: 40 uploads / 15 min per session cookie.
const uploadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 40,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  keyGenerator: (req) => req.cookies?.naa_session || req.ip,
  message: { error: "Too many uploads. Please slow down for a bit." },
});

const router = Router();
router.use(requireAuth, requireCsrf, requireFreshPassword);

router.post("/:section", uploadLimiter, upload.single("file"), async (req, res, next) => {
  try {
    const section = String(req.params.section || "").toLowerCase();
    if (!KEY_RE.test(section)) {
      return res.status(400).json({ error: "Invalid section key" });
    }
    const policy = policyFor(section);
    if (!policy) {
      return res.status(400).json({ error: `Section '${section}' does not accept image uploads.` });
    }
    if (!req.file || !req.file.buffer || req.file.buffer.length === 0) {
      return res.status(400).json({ error: "No file uploaded (field name must be 'file')" });
    }

    // --- 1. Real content-type via magic bytes ---
    const kind = await fileTypeFromBuffer(req.file.buffer);
    if (!kind || !ALLOWED_KINDS.has(kind.mime)) {
      audit({ userId: req.user.id, action: "upload.reject.type", meta: { detected: kind?.mime, claimed: req.file.mimetype }, ip: req.ip });
      return res.status(415).json({ error: `File must be a JPG, PNG, WebP or GIF (detected: ${kind?.mime || "unknown"}).` });
    }

    // --- 2. Re-encode with sharp: strip EXIF/embedded metadata, cap dimensions ---
    // rotate() honors orientation EXIF before we strip it, so photos stay upright.
    // withMetadata is intentionally NOT called — we want to drop all metadata.
    const pipeline = sharp(req.file.buffer, { failOn: "error" })
      .rotate()
      .resize({
        width: policy.maxWidth,
        height: policy.maxHeight,
        fit: "inside",
        withoutEnlargement: true,
      });

    const encode = (q) =>
      policy.format === "jpeg"
        ? pipeline.clone().jpeg({ quality: q, mozjpeg: true }).toBuffer()
        : pipeline.clone().webp({ quality: q, effort: 4 }).toBuffer();

    let quality = policy.quality;
    let out = await encode(quality);
    while (out.length > policy.maxBytes && quality > 45) {
      quality -= 8;
      out = await encode(quality);
    }
    if (out.length > policy.maxBytes) {
      audit({ userId: req.user.id, action: "upload.reject.oversize", meta: { section, bytes: out.length, cap: policy.maxBytes }, ip: req.ip });
      return res.status(413).json({
        error: `Image could not be compressed under ${Math.round(policy.maxBytes / 1024)} KB for section '${section}'. Try a smaller / simpler image.`,
      });
    }

    // --- 3. Randomize filename (UUID), write to per-section folder ---
    const ext = policy.format === "jpeg" ? "jpg" : policy.format;
    const filename = `${uuidv4()}.${ext}`;

    const dirAbs = path.join(UPLOAD_ROOT, section);
    fs.mkdirSync(dirAbs, { recursive: true });

    // Path traversal guard: verify resolved final path is inside UPLOAD_ROOT.
    const fullPath = path.resolve(dirAbs, filename);
    if (!fullPath.startsWith(UPLOAD_ROOT + path.sep)) {
      return res.status(400).json({ error: "Invalid destination path" });
    }
    fs.writeFileSync(fullPath, out);

    const relPath = `/uploads/${section}/${filename}`;
    audit({
      userId: req.user.id,
      action: "upload.ok",
      target: `${section}/${filename}`,
      meta: { detected: kind.mime, format: policy.format, quality, bytes: out.length },
      ip: req.ip,
    });

    res.status(201).json({
      imagePath: relPath,
      bytes: out.length,
      format: policy.format,
      quality,
    });
  } catch (err) {
    if (err && err.message && /image|input|unsupported/i.test(err.message)) {
      audit({ userId: req.user.id, action: "upload.reject.decode", meta: { err: err.message }, ip: req.ip });
      return res.status(400).json({ error: "Could not read that as an image." });
    }
    next(err);
  }
});

// Multer error handler (has to be defined after the route to catch its errors).
router.use((err, req, res, next) => {
  if (err && err.code === "LIMIT_FILE_SIZE") {
    return res.status(413).json({ error: `File too large (max ${Math.round(RAW_MAX_BYTES / 1024 / 1024)} MB).` });
  }
  if (err && err.message === "Unsupported file type") {
    return res.status(415).json({ error: err.message });
  }
  next(err);
});

export default router;
export { UPLOAD_ROOT };
