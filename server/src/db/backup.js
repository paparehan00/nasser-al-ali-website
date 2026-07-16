// SQLite hot backup — uses the SQLite online-backup API via better-sqlite3.
// Safe to run while the app is serving traffic. Writes to data/backups/ and
// prunes to the newest KEEP files.

import fs from "node:fs";
import path from "node:path";
import { db } from "./connection.js";
import { env } from "../config/env.js";

const BACKUP_DIR = path.join(path.dirname(env.dbPath), "backups");
const KEEP = 30;

fs.mkdirSync(BACKUP_DIR, { recursive: true });

const now = new Date();
const stamp =
  now.getUTCFullYear() +
  String(now.getUTCMonth() + 1).padStart(2, "0") +
  String(now.getUTCDate()).padStart(2, "0") + "-" +
  String(now.getUTCHours()).padStart(2, "0") +
  String(now.getUTCMinutes()).padStart(2, "0") +
  String(now.getUTCSeconds()).padStart(2, "0");

const dest = path.join(BACKUP_DIR, `app-${stamp}.db`);

const doBackup = async () => {
  await db.backup(dest);
  const bytes = fs.statSync(dest).size;
  console.log(`Backup OK → ${dest} (${(bytes / 1024).toFixed(1)} KB)`);

  const files = fs.readdirSync(BACKUP_DIR)
    .filter((f) => /^app-\d{8}-\d{6}\.db$/.test(f))
    .sort()
    .reverse();
  const stale = files.slice(KEEP);
  for (const f of stale) {
    fs.unlinkSync(path.join(BACKUP_DIR, f));
    console.log(`  pruned ${f}`);
  }
  console.log(`Retained ${Math.min(files.length, KEEP)} backup(s).`);
};

doBackup().catch((err) => {
  console.error("Backup FAILED:", err);
  process.exit(1);
});
