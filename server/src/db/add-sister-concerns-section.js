/**
 * Idempotent migration: provisions the "sister-concerns" content_section row
 * and its 10 company-logo items from user-supplied source artwork.
 *
 * The source exports are inconsistent (mixed portrait/square canvases, wide
 * variable whitespace margins), so each logo is auto-cropped to its actual
 * content bounding box (by scanning for pixels that deviate from the white
 * background, ignoring a thin edge-artifact border some exports have), then
 * centered on a fixed white square canvas so all ten logos share identical
 * framing regardless of source size/aspect ratio. The result is re-encoded
 * through the same resize/webp/size-cap logic uploads.js uses for real
 * admin-panel uploads, and written into the real uploads dir — so these
 * items are indistinguishable from ones added via the admin UI and can be
 * replaced there the same way.
 *
 * Safe to run multiple times — skips the section/items if already present.
 * Run: node src/db/add-sister-concerns-section.js   (from server/)
 */
import "dotenv/config";
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";
import { v4 as uuidv4 } from "uuid";
import { db } from "./connection.js";
import { env } from "../config/env.js";
import { policyFor } from "../config/uploadPolicies.js";

const SECTION_KEY = "sister-concerns";
const SOURCE_DIR = "/mnt/c/Users/HP/Downloads";

const COMPANIES = [
  { file: "OwSXb.jpg", name: { en: "Nasser Al Ali Group", ar: "مجموعة ناصر العلي" } },
  { file: "JD1qJ.jpg", name: { en: "Nasser Al Ali Contracting", ar: "ناصر العلي للمقاولات" } },
  { file: "PaJ3t.jpg", name: { en: "Nasser Bin Ali Trading Est.", ar: "مؤسسة ناصر بن علي التجارية" } },
  { file: "rQLHS.jpg", name: { en: "Nasser Al Ali International", ar: "ناصر العلي العالمية" } },
  { file: "ChatGPT Image Jul 26, 2026, 02_07_48 PM.png", name: { en: "Nasser Al Ali Roads", ar: "ناصر العلي للطرق" } },
  { file: "ChatGPT Image Jul 26, 2026, 02_09_15 PM.png", name: { en: "SAI Qatar Trading & Contracting", ar: "ساي قطر للتجارة والمقاولات" } },
  { file: "ChatGPT Image Jul 26, 2026, 02_09_53 PM.png", name: { en: "Doha Mechanical Engineering & Development", ar: "الدوحة للهندسة الميكانيكية والآعمار" } },
  { file: "ChatGPT Image Jul 26, 2026, 02_12_01 PM.png", name: { en: "Al Magateer Trading & Contracting Co.", ar: "المغاتير للتجارة والمقاولات" } },
  { file: "ChatGPT Image Jul 26, 2026, 02_12_40 PM.png", name: { en: "Memar International Transport & Contracting", ar: "معمار العالمية للنقل والمقاولات" } },
  { file: "ChatGPT Image Jul 26, 2026, 02_13_08 PM.png", name: { en: "Saoud Al Ali Farming & Products Trading", ar: "سعود العلي للزراعة وتجارة المنتجات" } },
];

const CANVAS = 640;       // final square canvas, px
const FILL_RATIO = 0.82;  // logo content fills this fraction of the canvas (leaves even margin)
const EDGE_SKIP = 12;     // ignore a thin edge-artifact border some exports have
const DEV_THRESHOLD = 30; // pixel must differ from white by more than this to count as "content"

async function findContentBox(buffer) {
  const { data, info } = await sharp(buffer).flatten({ background: "#ffffff" }).raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;
  let minX = width, maxX = 0, minY = height, maxY = 0;
  for (let y = EDGE_SKIP; y < height - EDGE_SKIP; y += 2) {
    for (let x = EDGE_SKIP; x < width - EDGE_SKIP; x += 2) {
      const i = (y * width + x) * channels;
      const dev = Math.max(Math.abs(data[i] - 255), Math.abs(data[i + 1] - 255), Math.abs(data[i + 2] - 255));
      if (dev > DEV_THRESHOLD) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }
  if (maxX <= minX || maxY <= minY) return { left: 0, top: 0, width, height };
  return { left: minX, top: minY, width: maxX - minX, height: maxY - minY };
}

async function processLogo(srcPath, policy) {
  const raw = fs.readFileSync(srcPath);
  const box = await findContentBox(raw);
  const cropped = await sharp(raw).flatten({ background: "#ffffff" }).extract(box).toBuffer();

  const targetBox = Math.round(CANVAS * FILL_RATIO);
  const fitted = await sharp(cropped)
    .resize({ width: targetBox, height: targetBox, fit: "inside", withoutEnlargement: true })
    .toBuffer();
  const { width: fw, height: fh } = await sharp(fitted).metadata();

  const canvas = sharp({
    create: { width: CANVAS, height: CANVAS, channels: 3, background: "#ffffff" },
  }).composite([
    { input: fitted, left: Math.round((CANVAS - fw) / 2), top: Math.round((CANVAS - fh) / 2) },
  ]);

  const encode = (q) => canvas.clone().webp({ quality: q, effort: 4 }).toBuffer();
  let quality = policy.quality;
  let out = await encode(quality);
  while (out.length > policy.maxBytes && quality > 45) {
    quality -= 8;
    out = await encode(quality);
  }
  return out;
}

async function main() {
  const existingSection = db.prepare("SELECT key FROM content_sections WHERE key = ?").get(SECTION_KEY);
  if (!existingSection) {
    db.prepare(`
      INSERT INTO content_sections (key, overline_en, overline_ar, title_en, title_ar, lede_en, lede_ar, extra)
      VALUES (@key, @overline_en, @overline_ar, @title_en, @title_ar, @lede_en, @lede_ar, '{}')
    `).run({
      key: SECTION_KEY,
      overline_en: "OUR GROUP", overline_ar: "مجموعتنا",
      title_en: "Sister Concerns", title_ar: "الشركات الشقيقة",
      lede_en: "Part of the Nasser Al Ali Enterprises group, sister companies extending our reach across related industries.",
      lede_ar: "جزء من مجموعة ناصر العلي للمقاولات، شركات شقيقة توسّع حضورنا في قطاعات ذات صلة.",
    });
    console.log(`  added section [${SECTION_KEY}]`);
  } else {
    console.log(`  section exists [${SECTION_KEY}]`);
  }

  const existingCount = db.prepare("SELECT COUNT(*) AS n FROM content_items WHERE section_key = ?").get(SECTION_KEY).n;
  if (existingCount > 0) {
    console.log(`  skip items (already ${existingCount} present)`);
    return;
  }

  const policy = policyFor(SECTION_KEY);
  if (!policy) throw new Error(`No upload policy registered for '${SECTION_KEY}' — add one to uploadPolicies.js first.`);

  const dirAbs = path.join(env.uploadRoot, SECTION_KEY);
  fs.mkdirSync(dirAbs, { recursive: true });

  const insertItem = db.prepare(`
    INSERT INTO content_items (section_key, sort_order, image_path, data)
    VALUES (@section_key, @sort_order, @image_path, @data)
  `);

  let order = 0;
  for (const co of COMPANIES) {
    const srcPath = path.join(SOURCE_DIR, co.file);
    if (!fs.existsSync(srcPath)) {
      console.log(`  MISSING source, skipped: ${co.file}`);
      continue;
    }
    const out = await processLogo(srcPath, policy);
    const filename = `${uuidv4()}.webp`;
    fs.writeFileSync(path.join(dirAbs, filename), out);
    const imagePath = `/uploads/${SECTION_KEY}/${filename}`;
    insertItem.run({
      section_key: SECTION_KEY,
      sort_order: order,
      image_path: imagePath,
      data: JSON.stringify({ name: co.name }),
    });
    console.log(`  added item [${co.name.en}] -> ${imagePath} (${Math.round(out.length / 1024)} KB)`);
    order += 1;
  }
  console.log("\nDone.\n");
}

main().catch((err) => { console.error(err); process.exit(1); });
