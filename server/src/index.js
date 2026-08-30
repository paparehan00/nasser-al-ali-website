import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { db } from "./db/connection.js";
import { env } from "./config/env.js";
import { verifyMailer } from "./utils/mailer.js";

// NOTE: ./app.js is imported *dynamically*, further down, and must stay that
// way. Its route modules (routes/admin.js, routes/content.js, utils/audit.js)
// call db.prepare() at module scope, and ES imports are fully evaluated before
// the importing module's body runs. A static import here would therefore run
// all 18 of those prepare() calls before the schema below has been applied,
// and every one of them throws "no such table" against an empty database.
//
// That is precisely the fresh-volume first-deploy case the schema apply exists
// to serve, so a static import turns the first boot into a crash loop.

// Auto-apply the schema on boot. Idempotent (all statements are IF NOT EXISTS).
// This means a fresh Railway deploy with a fresh volume just works — no
// separate migration step needed.
const __dirname = path.dirname(fileURLToPath(import.meta.url));
try {
  const schema = fs.readFileSync(path.join(__dirname, "db", "schema.sql"), "utf8");
  db.exec(schema);
} catch (err) {
  console.error("Boot: schema apply failed:", err);
  process.exit(1);
}

// The repo ships server/uploads/ with the images the seeded content rows
// point at. In production UPLOAD_ROOT points at the mounted volume instead,
// so a fresh volume starts empty and every /uploads/... URL 404s until the
// files are put there by hand. Copy them across on boot instead - it is the
// same idea as applying the schema above, and it removes the one manual
// drag-and-drop step from the go-live runbook.
//
// Never overwrites: a file already on the volume is one an admin uploaded (or
// one we copied on an earlier boot), and always wins over the repo copy.
function seedUploads() {
  const repoUploads = path.join(env.serverRoot, "uploads");
  if (path.resolve(repoUploads) === path.resolve(env.uploadRoot)) return; // dev
  if (!fs.existsSync(repoUploads)) return;

  let copied = 0;
  const walk = (srcDir, destDir) => {
    fs.mkdirSync(destDir, { recursive: true });
    for (const entry of fs.readdirSync(srcDir, { withFileTypes: true })) {
      const src = path.join(srcDir, entry.name);
      const dest = path.join(destDir, entry.name);
      if (entry.isDirectory()) walk(src, dest);
      else if (!fs.existsSync(dest)) {
        fs.copyFileSync(src, dest);
        copied += 1;
      }
    }
  };

  try {
    walk(repoUploads, env.uploadRoot);
    if (copied > 0) console.log(`Boot: seeded ${copied} upload file(s) into ${env.uploadRoot}`);
  } catch (err) {
    // Non-fatal: the site still serves, some images just 404 until fixed.
    console.error("Boot: seeding uploads failed:", err.message);
  }
}

seedUploads();

// Safe now: the schema exists, so the route modules' module-scope prepare()
// calls will resolve. See the note at the top of this file.
const { createApp } = await import("./app.js");

const app = createApp();

app.listen(env.port, () => {
  console.log(`NAA API listening on http://localhost:${env.port} (${env.nodeEnv})`);
  console.log(`  DB:      ${env.dbPath}`);
  console.log(`  uploads: ${env.uploadRoot}`);
  console.log(`  origins: ${env.clientOrigins.join(", ")}`);
  verifyMailer().catch(() => {});
});
