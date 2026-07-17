import crypto from "node:crypto";
import { CSRF_COOKIE, csrfCookieOpts } from "./cookies.js";

const CSRF_HEADER = "x-csrf-token";

export function issueCsrfIfMissing(req, res, next) {
  if (!req.cookies[CSRF_COOKIE]) {
    const token = crypto.randomBytes(24).toString("hex");
    res.cookie(CSRF_COOKIE, token, csrfCookieOpts());
    req.cookies[CSRF_COOKIE] = token;
  }
  next();
}

export function requireCsrf(req, res, next) {
  const cookieTok = req.cookies[CSRF_COOKIE];
  const headerTok = req.get(CSRF_HEADER);
  if (!cookieTok || !headerTok || cookieTok.length !== headerTok.length) {
    return res.status(403).json({ error: "CSRF token missing or invalid" });
  }
  try {
    const a = Buffer.from(cookieTok);
    const b = Buffer.from(headerTok);
    if (!crypto.timingSafeEqual(a, b)) throw new Error("mismatch");
  } catch {
    return res.status(403).json({ error: "CSRF token mismatch" });
  }
  next();
}

// Only enforce CSRF on state-changing verbs. Safe methods (GET/HEAD/OPTIONS)
// don't need the double-submit check because browsers won't send request
// bodies from cross-origin GET/link-clicks in a way that can mutate state.
export function requireCsrfOnUnsafe(req, res, next) {
  const safe = req.method === "GET" || req.method === "HEAD" || req.method === "OPTIONS";
  if (safe) return next();
  return requireCsrf(req, res, next);
}
