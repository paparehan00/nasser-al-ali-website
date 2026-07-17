import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { db } from "./db/connection.js";
import { createApp } from "./app.js";
import { env } from "./config/env.js";

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

const app = createApp();

app.listen(env.port, () => {
  console.log(`NAA API listening on http://localhost:${env.port} (${env.nodeEnv})`);
  console.log(`  DB:      ${env.dbPath}`);
  console.log(`  uploads: ${env.uploadRoot}`);
  console.log(`  origins: ${env.clientOrigins.join(", ")}`);
});
