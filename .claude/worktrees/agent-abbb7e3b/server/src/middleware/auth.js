import { verifySession } from "../utils/jwt.js";
import { SESSION_COOKIE } from "./cookies.js";
import { db } from "../db/connection.js";

export function requireAuth(req, res, next) {
  const token = req.cookies[SESSION_COOKIE];
  if (!token) return res.status(401).json({ error: "Not authenticated" });

  let claims;
  try {
    claims = verifySession(token);
  } catch {
    return res.status(401).json({ error: "Session expired or invalid" });
  }

  const user = db
    .prepare("SELECT id, email, must_change_password FROM users WHERE id = ?")
    .get(claims.sub);
  if (!user) return res.status(401).json({ error: "User no longer exists" });

  req.user = {
    id: user.id,
    email: user.email,
    mustChangePassword: !!user.must_change_password,
  };
  next();
}

export function requireFreshPassword(req, res, next) {
  if (req.user?.mustChangePassword) {
    return res
      .status(403)
      .json({ error: "Password change required", code: "PASSWORD_CHANGE_REQUIRED" });
  }
  next();
}
