import { Router } from "express";
import { db } from "../db/connection.js";

const router = Router();

const KEY_RE = /^[a-z][a-z0-9_-]{0,63}$/;

const selectSection = db.prepare(`
  SELECT key, overline_en, overline_ar, title_en, title_ar, lede_en, lede_ar, extra, updated_at
  FROM content_sections
  WHERE key = ?
`);

const selectItems = db.prepare(`
  SELECT id, sort_order AS sortOrder, image_path AS imagePath, data
  FROM content_items
  WHERE section_key = ?
  ORDER BY sort_order ASC, id ASC
`);

function shapeSection(row) {
  let extra = {};
  try { extra = row.extra ? JSON.parse(row.extra) : {}; } catch { /* ignore */ }
  return {
    key: row.key,
    overline: { en: row.overline_en, ar: row.overline_ar },
    title:    { en: row.title_en,    ar: row.title_ar },
    lede:     { en: row.lede_en,     ar: row.lede_ar },
    extra,
    updatedAt: row.updated_at,
  };
}

function shapeItem(row) {
  let data = {};
  try { data = row.data ? JSON.parse(row.data) : {}; } catch { /* ignore */ }
  return {
    id: row.id,
    sortOrder: row.sortOrder,
    imagePath: row.imagePath,
    data,
  };
}

router.get("/:key", (req, res) => {
  const key = String(req.params.key || "").toLowerCase();
  if (!KEY_RE.test(key)) return res.status(400).json({ error: "Invalid section key" });

  const sectionRow = selectSection.get(key);
  if (!sectionRow) return res.status(404).json({ error: "Section not found" });

  const items = selectItems.all(key).map(shapeItem);

  // Public GET: cache in the browser for a minute (edits will beat the cache
  // via ETag miss when the admin panel invalidates).
  res.set("Cache-Control", "public, max-age=60");
  res.json({ section: shapeSection(sectionRow), items });
});

export default router;
