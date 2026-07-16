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
