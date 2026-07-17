import { Router } from "express";
import { db } from "../db/connection.js";
import { hashPassword, verifyPassword, isPasswordStrongEnough } from "../utils/password.js";
import { signSession } from "../utils/jwt.js";
import { audit } from "../utils/audit.js";
import { SESSION_COOKIE, sessionCookieOpts } from "../middleware/cookies.js";
import { requireAuth } from "../middleware/auth.js";
import { requireCsrf } from "../middleware/csrf.js";
import { loginLimiter } from "../middleware/rateLimit.js";

const router = Router();

const LOCKOUT_THRESHOLD = 5;
const LOCKOUT_MS = 15 * 60 * 1000;

router.get("/csrf", (req, res) => {
  res.json({ csrfToken: req.cookies.naa_csrf });
});

router.post("/login", loginLimiter, requireCsrf, (req, res) => {
  const email = String(req.body?.email || "").trim().toLowerCase();
  const password = String(req.body?.password || "");
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password required" });
  }

  const user = db
    .prepare(
      `SELECT id, email, password_hash, must_change_password, failed_attempts, locked_until
       FROM users WHERE email = ?`
    )
    .get(email);

  const now = Date.now();
  if (user?.locked_until && user.locked_until > now) {
    return res.status(423).json({
      error: "Account temporarily locked due to failed attempts. Try again shortly.",
    });
  }

  const ok = user && verifyPassword(password, user.password_hash);
  if (!ok) {
    if (user) {
    //   const attempts = user.failed_attempts + 1;
    //   const lockedUntil = attempts >= LOCKOUT_THRESHOLD ? now + LOCKOUT_MS : null;
    //   db.prepare(
    //     `UPDATE users SET failed_attempts = ?, locked_until = ?, updated_at = unixepoch()
    //      WHERE id = ?`
    //   ).run(attempts, lockedUntil, user.id);
    //   audit({ userId: user.id, action: "login.fail", ip: req.ip });
    // } else {
    //   audit({ action: "login.fail.unknown", meta: { email }, ip: req.ip });
     }
    return res.status(401).json({ error: "Invalid email or password" });
  }

  db.prepare(
    `UPDATE users SET failed_attempts = 0, locked_until = NULL, updated_at = unixepoch()
     WHERE id = ?`
  ).run(user.id);

  const token = signSession({ sub: user.id, email: user.email });
  res.cookie(SESSION_COOKIE, token, sessionCookieOpts());
  audit({ userId: user.id, action: "login.ok", ip: req.ip });

  res.json({
    user: {
      id: user.id,
      email: user.email,
      mustChangePassword: !!user.must_change_password,
    },
  });
});

router.post("/logout", requireCsrf, (req, res) => {
  res.clearCookie(SESSION_COOKIE, { ...sessionCookieOpts(), maxAge: 0 });
  res.json({ ok: true });
});

router.get("/me", requireAuth, (req, res) => {
  res.json({ user: req.user });
});

router.post("/change-password", requireAuth, requireCsrf, (req, res) => {
  const current = String(req.body?.currentPassword || "");
  const next = String(req.body?.newPassword || "");
  if (!current || !next) {
    return res.status(400).json({ error: "Both currentPassword and newPassword required" });
  }
  if (!isPasswordStrongEnough(next)) {
    return res.status(400).json({
      error: "New password must be at least 10 characters and include a letter and a digit.",
    });
  }
  if (next === current) {
    return res.status(400).json({ error: "New password must differ from current password" });
  }

  const row = db
    .prepare("SELECT password_hash FROM users WHERE id = ?")
    .get(req.user.id);
  if (!row || !verifyPassword(current, row.password_hash)) {
    audit({ userId: req.user.id, action: "password.change.fail", ip: req.ip });
    return res.status(401).json({ error: "Current password is incorrect" });
  }

  const hash = hashPassword(next);
  db.prepare(
    `UPDATE users
       SET password_hash = ?, must_change_password = 0, updated_at = unixepoch()
     WHERE id = ?`
  ).run(hash, req.user.id);

  audit({ userId: req.user.id, action: "password.change.ok", ip: req.ip });
  res.json({ ok: true });
});

export default router;
