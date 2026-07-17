import rateLimit from "express-rate-limit";

export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  keyGenerator: (req) => {
    const email = (req.body?.email || "").toString().toLowerCase().slice(0, 200);
    return `${req.ip}|${email}`;
  },
  message: { error: "Too many login attempts. Please wait 15 minutes and try again." },
});

export const generalLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 120,
  standardHeaders: "draft-7",
  legacyHeaders: false,
});

// Tight limiter for the public booking form — 6 submissions per IP per hour.
export const bookingLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 6,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: { error: "Too many submissions from this address. Please try again in an hour or contact us directly at +974 6655 7728." },
});
