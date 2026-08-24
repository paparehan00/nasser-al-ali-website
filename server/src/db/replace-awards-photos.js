/**
 * Replaces the "awards" section gallery: deletes the old 40 award-NN.webp
 * content_items (and their static files under client/public/assets/awards),
 * then adds the new batch of recognition/CSR photos the user dropped into
 * client/dist/assets (raw exports, double extensions like "1.jpg.jpeg").
 *
 * Each new photo is re-encoded through the same resize/webp/size-cap logic
 * uploads.js uses for real admin-panel uploads, and written into the real
 * uploads dir — so these items are indistinguishable from ones added via the
 * admin UI and can be managed there the same way.
 *
 * Run: node src/db/replace-awards-photos.js   (from server/)
 */
import "dotenv/config";
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";
import { v4 as uuidv4 } from "uuid";
import { db } from "./connection.js";
import { env } from "../config/env.js";
import { policyFor } from "../config/uploadPolicies.js";

const SECTION_KEY = "awards";
const SOURCE_DIR = path.resolve(import.meta.dirname, "../../../client/dist/assets");
const OLD_STATIC_DIR = path.resolve(import.meta.dirname, "../../../client/public/assets/awards");

const NEW_FILES = [
  "1.jpg.jpeg",
  "2.jpg.jpeg",
  "3.jpg.jpeg",
  "4 .jpg.jpeg",
  "5.jpeg",
  "6.jpeg",
  "7.jpg.jpeg",
  "8.jpg.jpeg",
  "9.jpg.jpeg",
  "last.jpg.jpeg",
  "from me.jpg.jpeg",
  "from me2.jpg.jpeg",
  "118854835_3370520302990734_5977879776340546037_n.jpg.jpeg",
  "125101964_3570954719613957_8764309812186199754_n.jpg.jpeg",
  "190725741_4120680254641398_8989468780920904360_n.jpg.jpeg",
  "471492037_9056538637722177_82121379002282110_n.jpg.jpeg",
  "47323714_2075262965849814_4090897942179741696_n.jpg.jpeg",
  "473737921_913733090906939_2935859983559483726_n.jpg.jpeg",
  "474127863_915333494080232_1094161651622796592_n.jpg.jpeg",
  "474534911_917338623879719_2001988189128043182_n.jpg.jpeg",
  "47580405_2075261905849920_4958039207743324160_n.jpg.jpeg",
  "62599540_2359501787425929_5271638839021010944_n.jpg.jpeg",
];

async function processPhoto(srcPath, policy) {
  const raw = fs.readFileSync(srcPath);
  const pipeline = sharp(raw, { failOn: "error" })
    .rotate()
    .resize({ width: policy.maxWidth, height: policy.maxHeight, fit: "inside", withoutEnlargement: true });

  const encode = (q) => pipeline.clone().webp({ quality: q, effort: 4 }).toBuffer();
  let quality = policy.quality;
  let out = await encode(quality);
  while (out.length > policy.maxBytes && quality > 45) {
    quality -= 8;
    out = await encode(quality);
  }
  return out;
}

async function main() {
  const policy = policyFor(SECTION_KEY);
  if (!policy) throw new Error(`No upload policy registered for '${SECTION_KEY}'.`);

  // --- 1. Delete old items (DB rows) ---
  const oldItems = db.prepare("SELECT id, image_path FROM content_items WHERE section_key = ?").all(SECTION_KEY);
  const deleteItem = db.prepare("DELETE FROM content_items WHERE id = ?");
  const tx = db.transaction(() => {
    for (const it of oldItems) deleteItem.run(it.id);
  });
  tx();
  console.log(`  deleted ${oldItems.length} old item rows`);

  // --- 2. Delete old static files (client/public/assets/awards) ---
  if (fs.existsSync(OLD_STATIC_DIR)) {
    const files = fs.readdirSync(OLD_STATIC_DIR);
    for (const f of files) fs.unlinkSync(path.join(OLD_STATIC_DIR, f));
    fs.rmdirSync(OLD_STATIC_DIR);
    console.log(`  removed old static dir (${files.length} files): ${OLD_STATIC_DIR}`);
  }

  // --- 3. Process + insert new items ---
  const dirAbs = path.join(env.uploadRoot, SECTION_KEY);
  fs.mkdirSync(dirAbs, { recursive: true });

  const insertItem = db.prepare(`
    INSERT INTO content_items (section_key, sort_order, image_path, data)
    VALUES (@section_key, @sort_order, @image_path, @data)
  `);

  let order = 0;
  for (const file of NEW_FILES) {
    const srcPath = path.join(SOURCE_DIR, file);
    if (!fs.existsSync(srcPath)) {
      console.log(`  MISSING source, skipped: ${file}`);
      continue;
    }
    const out = await processPhoto(srcPath, policy);
    const filename = `${uuidv4()}.webp`;
    fs.writeFileSync(path.join(dirAbs, filename), out);
    const imagePath = `/uploads/${SECTION_KEY}/${filename}`;
    insertItem.run({
      section_key: SECTION_KEY,
      sort_order: order,
      image_path: imagePath,
      data: JSON.stringify({ alt: `Chairman presenting a recognition award to a team member (${order + 1})` }),
    });
    console.log(`  added item [${file}] -> ${imagePath} (${Math.round(out.length / 1024)} KB)`);
    order += 1;
  }
  console.log(`\nDone. ${order} new award/CSR photos live.\n`);
}

main().catch((err) => { console.error(err); process.exit(1); });
