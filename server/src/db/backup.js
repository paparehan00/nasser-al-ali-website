// SQLite hot backup — uses the SQLite online-backup API via better-sqlite3.
// Safe to run while the app is serving traffic. Writes to data/backups/ and
// prunes to the newest KEEP files.
//
// data/backups/ sits on the same volume as app.db in production, so it only
// protects against bad edits, not against losing the volume. Every run also
// ships the fresh copy off-platform (see utils/offsiteBackup.js); that is the
// copy that actually survives a disk failure.

import fs from "node:fs";
import path from "node:path";
import { db } from "./connection.js";
import { env } from "../config/env.js";
import { shipOffsite } from "../utils/offsiteBackup.js";

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

  const offsite = await shipOffsite(dest);
  if (offsite.ok) {
    console.log(`Off-site copy → ${offsite.targets.join(", ")}`);
    for (const e of offsite.errors) console.warn(`  partial failure: ${e}`);
  } else if (offsite.errors[0] === "no off-site target configured") {
    console.warn(
      "WARNING: no off-site backup target set. This backup lives on the same\n" +
      "         volume as the live database, so a lost volume loses both.\n" +
      "         Set BACKUP_S3_* or BACKUP_EMAIL_TO. See .env.example."
    );
  } else {
    console.error(`Off-site copy FAILED: ${offsite.errors.join("; ")}`);
    process.exitCode = 2; // local backup is fine; flag the off-site failure
  }
};

doBackup().catch((err) => {
  console.error("Backup FAILED:", err);
  process.exit(1);
});
