import { Router } from "express";
import { db } from "../db/connection.js";
import { bookingLimiter } from "../middleware/rateLimit.js";
import { sendCustomerConfirmation, sendAdminNotification } from "../utils/mailer.js";
import { env } from "../config/env.js";

const router = Router();

// Allowed service values matching the frontend select.
const VALID_SERVICES = new Set(["manpower", "equipment", "civil", "mep", "cleaning", "business"]);

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function bad(res, msg) {
  return res.status(400).json({ error: msg });
}

router.post("/", bookingLimiter, async (req, res) => {
  // ── Honeypot ───────────────────────────────────────────────────────────────
  // The "bot-field" input is hidden from real users. Bots that fill every
  // field will populate it; we silently return 200 so the bot can't probe
  // for the real rejection path.
  if (req.body["bot-field"]) {
    return res.status(200).json({ ok: true });
  }

  // ── Validation ─────────────────────────────────────────────────────────────
  const name    = String(req.body.name    || "").trim().slice(0, 200);
  const company = String(req.body.company || "").trim().slice(0, 200);
  const email   = String(req.body.email   || "").trim().slice(0, 254).toLowerCase();
  const phone   = String(req.body.phone   || "").trim().slice(0, 50);
  const service = String(req.body.service || "").trim().toLowerCase();
  const preferredDate = String(req.body.preferredDate || "").trim().slice(0, 100);
  const message = String(req.body.message || "").trim().slice(0, 4000);

  if (!name)                         return bad(res, "Name is required.");
  if (!EMAIL_RE.test(email))         return bad(res, "A valid email address is required.");
  if (!phone)                        return bad(res, "Phone number is required.");
  if (!VALID_SERVICES.has(service))  return bad(res, "Please select a service.");
  if (!message)                      return bad(res, "Please describe how we can help.");

  const ip = req.ip ?? req.socket?.remoteAddress ?? null;

  // ── Persist ────────────────────────────────────────────────────────────────
  let bookingId;
  try {
    const stmt = db.prepare(`
      INSERT INTO bookings (name, company, email, phone, service, preferred_date, message, ip)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);
    const result = stmt.run(name, company || null, email, phone || null, service, preferredDate || null, message, ip);
    bookingId = result.lastInsertRowid;
  } catch (err) {
    console.error("[bookings] DB insert failed:", err);
    return res.status(500).json({ error: "Could not save your request. Please try again or contact us directly." });
  }

  // ── Emails (non-blocking — never lose a booking over an email failure) ──────
  const booking = { id: bookingId, name, company, email, phone, service, preferred_date: preferredDate, message, ip, created_at: Math.floor(Date.now() / 1000) };
  let emailSent = false;

  try {
    const tasks = [sendCustomerConfirmation(booking)];
    if (env.notifyEmail) tasks.push(sendAdminNotification(booking));
    await Promise.all(tasks);
    emailSent = true;

    // Mark in DB that emails went out.
    db.prepare("UPDATE bookings SET email_sent = 1 WHERE id = ?").run(bookingId);
  } catch (err) {
    console.error(`[bookings] Email send failed for booking #${bookingId}:`, err.message);
    // Booking is already saved — not a fatal error for the user.
  }

  return res.status(200).json({
    ok: true,
    message: emailSent
      ? "Your request has been received. A confirmation has been sent to your email."
      : "Your request has been received. Our team will be in touch shortly.",
  });
});

export default router;
