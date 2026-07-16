// Small hand-rolled validators for admin bodies. Kept dependency-free —
// zod would be overkill for a 4-shape surface.

const MAX_TEXT = 5000;
const MAX_PATH = 500;

export class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.status = 400;
    this.expose = true;
  }
}

export function isPlainObject(v) {
  return v != null && typeof v === "object" && !Array.isArray(v);
}

// Accepts { en?: string, ar?: string } or null/undefined (treated as empty).
// Rejects arrays, non-string values, oversize strings.
export function assertBilingual(name, v) {
  if (v == null) return { en: null, ar: null };
  if (!isPlainObject(v)) throw new ValidationError(`${name} must be an object with en/ar keys`);
  const out = {};
  for (const lang of ["en", "ar"]) {
    const raw = v[lang];
    if (raw == null) { out[lang] = null; continue; }
    if (typeof raw !== "string") throw new ValidationError(`${name}.${lang} must be a string or null`);
    if (raw.length > MAX_TEXT) throw new ValidationError(`${name}.${lang} exceeds ${MAX_TEXT} characters`);
    out[lang] = raw;
  }
  return out;
}

// Recursively cap string lengths inside a JSON blob and reject non-plain
// values (functions, symbols) that JSON.stringify would silently drop.
function walkJsonSafe(v, path, depth) {
  if (depth > 12) throw new ValidationError(`${path}: JSON nested too deep`);
  if (v == null) return v;
  const t = typeof v;
  if (t === "string") {
    if (v.length > MAX_TEXT) throw new ValidationError(`${path}: string exceeds ${MAX_TEXT} characters`);
    return v;
  }
  if (t === "number" || t === "boolean") return v;
  if (Array.isArray(v)) {
    if (v.length > 1000) throw new ValidationError(`${path}: array too large`);
    return v.map((x, i) => walkJsonSafe(x, `${path}[${i}]`, depth + 1));
  }
  if (isPlainObject(v)) {
    const out = {};
    for (const k of Object.keys(v)) {
      if (k.length > 128) throw new ValidationError(`${path}: object key too long`);
      out[k] = walkJsonSafe(v[k], `${path}.${k}`, depth + 1);
    }
    return out;
  }
  throw new ValidationError(`${path}: unsupported JSON value type`);
}

export function assertJsonBlob(name, v) {
  if (v == null) return {};
  if (!isPlainObject(v)) throw new ValidationError(`${name} must be a JSON object`);
  return walkJsonSafe(v, name, 0);
}

// imagePath must be a safe relative URL: either /uploads/<section>/<file> or
// /assets/<...>. Rejects `javascript:`, `data:`, absolute http(s), backslash,
// null bytes, and any path traversal segments. Null is allowed (= no image).
export function assertSafeImagePath(name, v) {
  if (v == null || v === "") return null;
  if (typeof v !== "string") throw new ValidationError(`${name} must be a string`);
  if (v.length > MAX_PATH) throw new ValidationError(`${name} exceeds ${MAX_PATH} characters`);
  // Allow a `?v=…` cache-bust suffix but strip it for the security check.
  const clean = v.split("?")[0];
  if (/[\x00-\x1f\x7f\\]/.test(clean)) throw new ValidationError(`${name} contains illegal characters`);
  if (clean.includes("..")) throw new ValidationError(`${name} contains path traversal`);
  if (!/^\/(uploads|assets)\/[^\s]+$/.test(clean)) {
    throw new ValidationError(`${name} must start with /uploads/ or /assets/`);
  }
  return v;
}
