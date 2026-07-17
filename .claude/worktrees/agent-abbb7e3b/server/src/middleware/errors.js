import { env } from "../config/env.js";

export function notFound(req, res) {
  res.status(404).json({ error: "Not found" });
}

// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, _next) {
  const status = err.status || err.statusCode || 500;
  const payload = { error: err.expose ? err.message : "Internal server error" };
  if (!env.isProd) payload.stack = err.stack;
  if (status >= 500) console.error("[error]", err);
  res.status(status).json(payload);
}
