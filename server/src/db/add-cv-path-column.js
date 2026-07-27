/**
 * Idempotent migration: adds the cv_path column to an already-existing
 * applications table (schema.sql's CREATE TABLE IF NOT EXISTS won't touch a
 * table that already exists, so a fresh ALTER TABLE is needed for anyone
 * who ran migrate.js before this column was added).
 * Safe to run multiple times — skips if the column is already present.
 * Run: node src/db/add-cv-path-column.js   (from server/)
 */
import "dotenv/config";
import { db } from "./connection.js";

const cols = db.prepare("PRAGMA table_info(applications)").all();
const hasCol = cols.some((c) => c.name === "cv_path");

if (hasCol) {
  console.log("cv_path already present on applications — no change.");
} else {
  db.exec("ALTER TABLE applications ADD COLUMN cv_path TEXT");
  console.log("Added cv_path column to applications.");
}
