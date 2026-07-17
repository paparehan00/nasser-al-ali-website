import { env } from "../config/env.js";

export const SESSION_COOKIE = "naa_session";
export const CSRF_COOKIE = "naa_csrf";

export function sessionCookieOpts() {
  return {
    httpOnly: true,
    secure: env.isProd,
    sameSite: "strict",
    path: "/",
    maxAge: env.jwtTtlSeconds * 1000,
  };
}

export function csrfCookieOpts() {
  return {
    httpOnly: false,
    secure: env.isProd,
    sameSite: "strict",
    path: "/",
    maxAge: env.jwtTtlSeconds * 1000,
  };
}
