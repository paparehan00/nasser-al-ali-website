import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

const ALG = "HS256";

export function signSession(payload) {
  return jwt.sign(payload, env.jwtSecret, {
    algorithm: ALG,
    expiresIn: env.jwtTtlSeconds,
  });
}

export function verifySession(token) {
  return jwt.verify(token, env.jwtSecret, { algorithms: [ALG] });
}
