import { Router } from "express";
import { db } from "../db/connection.js";
import { requireAuth, requireFreshPassword } from "../middleware/auth.js";
import { requireCsrfOnUnsafe } from "../middleware/csrf.js";
import { audit } from "../utils/audit.js";
import { assertBilingual, assertJsonBlob, assertSafeImagePath, isPlainObject } from "../utils/validate.js";

const router = Router();

// Every admin route: authenticated, CSRF-checked on mutations (POST/PATCH/
// DELETE), and only usable after the forced first-login password change.
router.use(requireAuth, requireCsrfOnUnsafe, requireFreshPassword);

const KEY_RE = /^[a-z][a-z0-9_-]{0,63}$/;

// -----------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------

function parseJson(str, fallback = {}) {
  if (str == null) return fallback;
  try { return JSON.parse(str); } catch { return fallback; }
}

function assertKey(key, res) {
  if (!KEY_RE.test(key)) {
    res.status(400).json({ error: "Invalid section key" });
    return false;
  }
  return true;
}

function shapeSection(row) {
  return {
    key: row.key,
    overline: { en: row.overline_en, ar: row.overline_ar },
    title:    { en: row.title_en,    ar: row.title_ar },
    lede:     { en: row.lede_en,     ar: row.lede_ar },
    extra: parseJson(row.extra, {}),
    updatedAt: row.updated_at,
  };
}

function shapeItem(row) {
  return {
    id: row.id,
    sortOrder: row.sort_order,
    imagePath: row.image_path,
    data: parseJson(row.data, {}),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

const MAX_JSON = 50_000;

function safeJsonStringify(v, max = MAX_JSON) {
  const s = JSON.stringify(v ?? {});
  if (s.length > max) {
    const err = new Error(`JSON blob too large (${s.length}b > ${max}b limit)`);
    err.status = 413;
    err.expose = true;
    throw err;
  }
  return s;
}

// -----------------------------------------------------------------------
// Prepared statements
// -----------------------------------------------------------------------

const listSectionsStmt = db.prepare(`
  SELECT s.key, s.title_en, s.title_ar, s.updated_at,
         (SELECT COUNT(*) FROM content_items i WHERE i.section_key = s.key) AS item_count
  FROM content_sections s
  ORDER BY s.key ASC
`);

const getSectionStmt = db.prepare(`
  SELECT key, overline_en, overline_ar, title_en, title_ar, lede_en, lede_ar, extra, updated_at
  FROM content_sections
  WHERE key = ?
`);

const listItemsStmt = db.prepare(`
  SELECT id, sort_order, image_path, data, created_at, updated_at
  FROM content_items
  WHERE section_key = ?
  ORDER BY sort_order ASC, id ASC
`);

const updateSectionStmt = db.prepare(`
  UPDATE content_sections
     SET overline_en = @overline_en,
         overline_ar = @overline_ar,
         title_en    = @title_en,
         title_ar    = @title_ar,
         lede_en     = @lede_en,
         lede_ar     = @lede_ar,
         extra       = @extra,
         updated_at  = unixepoch()
   WHERE key = @key
`);

const getItemStmt = db.prepare(`SELECT id, section_key, sort_order, image_path, data, created_at, updated_at FROM content_items WHERE id = ?`);
const insertItemStmt = db.prepare(`INSERT INTO content_items (section_key, sort_order, image_path, data) VALUES (?, ?, ?, ?)`);
const updateItemStmt = db.prepare(`UPDATE content_items SET image_path = ?, data = ?, updated_at = unixepoch() WHERE id = ?`);
const deleteItemStmt = db.prepare(`DELETE FROM content_items WHERE id = ?`);
const updateItemOrderStmt = db.prepare(`UPDATE content_items SET sort_order = ?, updated_at = unixepoch() WHERE id = ? AND section_key = ?`);
const maxOrderStmt = db.prepare(`SELECT COALESCE(MAX(sort_order), -1) AS max FROM content_items WHERE section_key = ?`);

const listAuditStmt = db.prepare(`
  SELECT a.id, a.user_id, a.action, a.target, a.meta, a.ip, a.created_at,
         u.email AS user_email
  FROM audit_log a
  LEFT JOIN users u ON u.id = a.user_id
  ORDER BY a.id DESC
  LIMIT ? OFFSET ?
`);

const countAuditStmt = db.prepare(`SELECT COUNT(*) AS n FROM audit_log`);

// -----------------------------------------------------------------------
// Section-level routes
// -----------------------------------------------------------------------

router.get("/sections", (req, res) => {
  const rows = listSectionsStmt.all();
  res.json({
    sections: rows.map((r) => ({
      key: r.key,
      title: { en: r.title_en, ar: r.title_ar },
      itemCount: r.item_count,
      updatedAt: r.updated_at,
    })),
  });
});

router.get("/sections/:key", (req, res) => {
  const key = String(req.params.key || "").toLowerCase();
  if (!assertKey(key, res)) return;
  const row = getSectionStmt.get(key);
  if (!row) return res.status(404).json({ error: "Section not found" });
  const items = listItemsStmt.all(key).map(shapeItem);
  res.json({ section: shapeSection(row), items });
});

router.patch("/sections/:key", (req, res, next) => {
  try {
    const key = String(req.params.key || "").toLowerCase();
    if (!assertKey(key, res)) return;
    const existing = getSectionStmt.get(key);
    if (!existing) return res.status(404).json({ error: "Section not found" });

    const body = req.body || {};
    if (!isPlainObject(body)) return res.status(400).json({ error: "Body must be a JSON object" });

    const overline = assertBilingual("overline", body.overline);
    const title    = assertBilingual("title",    body.title);
    const lede     = assertBilingual("lede",     body.lede);
    const extra    = "extra" in body
      ? assertJsonBlob("extra", body.extra)
      : parseJson(existing.extra, {});

    updateSectionStmt.run({
      key,
      overline_en: overline.en,
      overline_ar: overline.ar,
      title_en:    title.en,
      title_ar:    title.ar,
      lede_en:     lede.en,
      lede_ar:     lede.ar,
      extra:       safeJsonStringify(extra),
    });

    audit({ userId: req.user.id, action: "section.update", target: key, ip: req.ip });
    const updated = getSectionStmt.get(key);
    res.json({ section: shapeSection(updated) });
  } catch (err) { next(err); }
});

// -----------------------------------------------------------------------
// Item routes
// -----------------------------------------------------------------------

router.post("/sections/:key/items", (req, res, next) => {
  try {
    const key = String(req.params.key || "").toLowerCase();
    if (!assertKey(key, res)) return;
    const section = getSectionStmt.get(key);
    if (!section) return res.status(404).json({ error: "Section not found" });

    const body = req.body || {};
    if (!isPlainObject(body)) return res.status(400).json({ error: "Body must be a JSON object" });
    const imagePath = assertSafeImagePath("imagePath", body.imagePath);
    const data = safeJsonStringify(assertJsonBlob("data", body.data));
    const nextOrder = maxOrderStmt.get(key).max + 1;

    const info = insertItemStmt.run(key, nextOrder, imagePath, data);
    const created = getItemStmt.get(info.lastInsertRowid);

    audit({ userId: req.user.id, action: "item.create", target: `${key}#${info.lastInsertRowid}`, ip: req.ip });
    res.status(201).json({ item: shapeItem(created) });
  } catch (err) { next(err); }
});

router.patch("/items/:id", (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id < 1) return res.status(400).json({ error: "Invalid item id" });
    const existing = getItemStmt.get(id);
    if (!existing) return res.status(404).json({ error: "Item not found" });

    const body = req.body || {};
    if (!isPlainObject(body)) return res.status(400).json({ error: "Body must be a JSON object" });
    const imagePath = "imagePath" in body
      ? assertSafeImagePath("imagePath", body.imagePath)
      : existing.image_path;
    const data = "data" in body
      ? safeJsonStringify(assertJsonBlob("data", body.data))
      : existing.data;

    updateItemStmt.run(imagePath, data, id);
    audit({ userId: req.user.id, action: "item.update", target: `${existing.section_key}#${id}`, ip: req.ip });
    res.json({ item: shapeItem(getItemStmt.get(id)) });
  } catch (err) { next(err); }
});

router.delete("/items/:id", (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id < 1) return res.status(400).json({ error: "Invalid item id" });
    const existing = getItemStmt.get(id);
    if (!existing) return res.status(404).json({ error: "Item not found" });

    deleteItemStmt.run(id);
    audit({ userId: req.user.id, action: "item.delete", target: `${existing.section_key}#${id}`, ip: req.ip });
    res.json({ ok: true });
  } catch (err) { next(err); }
});

router.post("/sections/:key/items/reorder", (req, res, next) => {
  try {
    const key = String(req.params.key || "").toLowerCase();
    if (!assertKey(key, res)) return;
    const section = getSectionStmt.get(key);
    if (!section) return res.status(404).json({ error: "Section not found" });

    const order = Array.isArray(req.body?.order) ? req.body.order : null;
    if (!order) return res.status(400).json({ error: "Body must be { order: [id, id, ...] }" });
    if (order.length > 500) return res.status(400).json({ error: "Too many items in reorder payload" });
    for (const id of order) {
      if (!Number.isInteger(id) || id < 1) return res.status(400).json({ error: "Non-integer id in order" });
    }

    const tx = db.transaction(() => {
      order.forEach((id, i) => updateItemOrderStmt.run(i, id, key));
    });
    tx();

    audit({ userId: req.user.id, action: "items.reorder", target: key, meta: { count: order.length }, ip: req.ip });
    const items = listItemsStmt.all(key).map(shapeItem);
    res.json({ items });
  } catch (err) { next(err); }
});

// -----------------------------------------------------------------------
// Audit log
// -----------------------------------------------------------------------

router.get("/audit", (req, res) => {
  const limit = Math.min(Math.max(Number(req.query.limit) || 100, 1), 500);
  const offset = Math.max(Number(req.query.offset) || 0, 0);

  const rows = listAuditStmt.all(limit, offset);
  const total = countAuditStmt.get().n;

  res.json({
    total,
    limit,
    offset,
    entries: rows.map((r) => ({
      id: r.id,
      action: r.action,
      target: r.target,
      user: r.user_email || (r.user_id ? `#${r.user_id}` : null),
      ip: r.ip,
      meta: parseJson(r.meta, null),
      ts: r.created_at,
    })),
  });
});

export default router;
