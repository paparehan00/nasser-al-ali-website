import express from "express";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { env } from "./config/env.js";
import { issueCsrfIfMissing } from "./middleware/csrf.js";
import { generalLimiter } from "./middleware/rateLimit.js";
import { notFound, errorHandler } from "./middleware/errors.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CLIENT_DIST = path.resolve(__dirname, "..", "..", "client", "dist");

import authRoutes from "./routes/auth.js";
import healthRoutes from "./routes/health.js";
import contentRoutes from "./routes/content.js";
import adminRoutes from "./routes/admin.js";
import uploadRoutes, { UPLOAD_ROOT } from "./routes/uploads.js";

export function createApp() {
  const app = express();

  app.set("trust proxy", 1);
  app.disable("x-powered-by");

  app.use(helmet());
  app.use(
    cors({
      origin(origin, cb) {
        if (!origin) return cb(null, true);
        if (env.clientOrigins.includes(origin)) return cb(null, true);
        return cb(new Error(`Origin ${origin} not allowed`));
      },
      credentials: true,
    })
  );
  app.use(express.json({ limit: "100kb" }));
  app.use(cookieParser());
  app.use(issueCsrfIfMissing);
  app.use("/api", generalLimiter);

  app.use("/api/health", healthRoutes);
  app.use("/api/auth", authRoutes);
  app.use("/api/content", contentRoutes);
  app.use("/api/admin", adminRoutes);
  app.use("/api/admin/uploads", uploadRoutes);

  // Serve uploaded images. Read-only static: express.static never executes
  // files, and we only ever write image bytes here from the upload pipeline
  // (validated by magic bytes + re-encoded by sharp, so nothing user-supplied
  // is on disk). Immutable cache because filenames are UUIDs — content
  // cannot change under a given URL.
  app.use(
    "/uploads",
    express.static(UPLOAD_ROOT, {
      dotfiles: "deny",
      etag: true,
      fallthrough: false,
      index: false,
      maxAge: "365d",
      immutable: true,
      setHeaders: (res) => {
        res.setHeader("X-Content-Type-Options", "nosniff");
      },
    })
  );

  // -----------------------------------------------------------------------
  // Production: also serve the built React app + SPA fallback so this one
  // Node process is the whole deploy. In dev we skip this — Vite dev server
  // (:5173) already serves the client and proxies /api + /uploads here.
  // -----------------------------------------------------------------------
  if (env.isProd && fs.existsSync(CLIENT_DIST)) {
    // Static: hashed JS/CSS get a year of immutable cache; everything else
    // (index.html, /js/consent.js etc.) is short-cached so admin edits
    // propagate quickly on hard reload.
    app.use(express.static(CLIENT_DIST, {
      index: false,
      etag: true,
      setHeaders: (res, filePath) => {
        if (/\.(js|css|woff2?|png|jpg|jpeg|webp|gif|svg|mp4|webm)$/i.test(filePath)) {
          if (/-[A-Za-z0-9_-]{8,}\./.test(filePath)) {
            // Vite-hashed asset: safe to lock in.
            res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
          } else {
            res.setHeader("Cache-Control", "public, max-age=300");
          }
        }
      },
    }));

    // SPA fallback: any non-/api, non-/uploads GET falls through to index.html
    // so React Router can handle client-side routes (/admin, /projects, etc.).
    app.get(/^\/(?!api|uploads).*/, (req, res, next) => {
      // Accept only GETs that look like browser navigations, not stray XHR.
      if (req.method !== "GET") return next();
      res.sendFile(path.join(CLIENT_DIST, "index.html"));
    });
  }

  app.use(notFound);
  app.use(errorHandler);

  return app;
}
