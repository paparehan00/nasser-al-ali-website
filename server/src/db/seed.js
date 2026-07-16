import bcrypt from "bcryptjs";
import { db } from "./connection.js";
import { env } from "../config/env.js";

if (!env.adminSeedEmail || !env.adminSeedPassword) {
  console.error("Refusing to seed: set ADMIN_EMAIL and ADMIN_PASSWORD in .env first.");
  process.exit(1);
}

const existing = db.prepare("SELECT id FROM users WHERE email = ?").get(env.adminSeedEmail);
if (existing) {
  console.log(`Admin ${env.adminSeedEmail} already exists (id=${existing.id}). No change.`);
  process.exit(0);
}

const hash = bcrypt.hashSync(env.adminSeedPassword, 12);

db.prepare(
  `INSERT INTO users (email, password_hash, must_change_password)
   VALUES (?, ?, 1)`
).run(env.adminSeedEmail, hash);

console.log(`Seeded admin ${env.adminSeedEmail} (must change password on first login).`);
