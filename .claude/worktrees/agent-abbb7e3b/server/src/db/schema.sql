-- NAA admin schema.
-- Phase 1: users + audit_log. Content tables land in Phase 3.

PRAGMA journal_mode = WAL;
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  must_change_password INTEGER NOT NULL DEFAULT 0,
  failed_attempts INTEGER NOT NULL DEFAULT 0,
  locked_until INTEGER,
  created_at INTEGER NOT NULL DEFAULT (unixepoch()),
  updated_at INTEGER NOT NULL DEFAULT (unixepoch())
);

CREATE TABLE IF NOT EXISTS audit_log (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER,
  action TEXT NOT NULL,
  target TEXT,
  meta TEXT,
  ip TEXT,
  created_at INTEGER NOT NULL DEFAULT (unixepoch())
);

CREATE INDEX IF NOT EXISTS idx_audit_user_time ON audit_log(user_id, created_at DESC);

-- Managed sections. One row per section (hero, stats, services, projects, ...).
-- Bilingual header fields are first-class columns; free-form section extras
-- (buttons, KPIs, chairman paragraphs, etc.) live in the `extra` JSON blob.
CREATE TABLE IF NOT EXISTS content_sections (
  key TEXT PRIMARY KEY,
  overline_en TEXT,
  overline_ar TEXT,
  title_en TEXT,
  title_ar TEXT,
  lede_en TEXT,
  lede_ar TEXT,
  extra TEXT NOT NULL DEFAULT '{}',
  updated_at INTEGER NOT NULL DEFAULT (unixepoch())
);

-- Section items (logos, projects, certifications, gallery images, etc.).
-- `image_path` is the safe relative path returned by the upload pipeline
-- (Phase 5). `data` is a JSON blob for per-item fields (name, caption,
-- bilingual title/body, etc.).
CREATE TABLE IF NOT EXISTS content_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  section_key TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  image_path TEXT,
  data TEXT NOT NULL DEFAULT '{}',
  created_at INTEGER NOT NULL DEFAULT (unixepoch()),
  updated_at INTEGER NOT NULL DEFAULT (unixepoch()),
  FOREIGN KEY (section_key) REFERENCES content_sections(key) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_items_section_order
  ON content_items(section_key, sort_order);
