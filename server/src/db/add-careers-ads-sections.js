/**
 * Idempotent migration: provisions the "careers" and "ads" content_sections
 * rows so they show up in the admin sidebar and the public API. Items (job
 * postings / poster images) are added later through the admin CRM, not here
 * — these start empty by design.
 * Safe to run multiple times — skips sections that already exist.
 * Run: node src/db/add-careers-ads-sections.js   (from server/)
 */
import "dotenv/config";
import { db } from "./connection.js";

function addSection(key, { overline, title, lede }) {
  const existing = db.prepare("SELECT key FROM content_sections WHERE key = ?").get(key);
  if (existing) {
    console.log(`  skip (exists) [${key}]`);
    return;
  }
  db.prepare(`
    INSERT INTO content_sections (key, overline_en, overline_ar, title_en, title_ar, lede_en, lede_ar, extra)
    VALUES (@key, @overline_en, @overline_ar, @title_en, @title_ar, @lede_en, @lede_ar, '{}')
  `).run({
    key,
    overline_en: overline.en, overline_ar: overline.ar,
    title_en: title.en, title_ar: title.ar,
    lede_en: lede.en, lede_ar: lede.ar,
  });
  console.log(`  added [${key}]`);
}

console.log("\nSections:");

addSection("careers", {
  overline: { en: "JOIN OUR TEAM", ar: "انضم إلى فريقنا" },
  title:    { en: "Careers at Nasser Al Ali Enterprises", ar: "الوظائف في ناصر العلي للمقاولات" },
  lede: {
    en: "We build careers the same way we build landmarks: with commitment, the right people, and room to grow. Explore current openings below.",
    ar: "نبني المسيرات المهنية بنفس الالتزام الذي نبني به المعالم، مع الأشخاص المناسبين ومساحة للنمو. تصفح الشواغر الحالية أدناه.",
  },
});

addSection("ads", {
  overline: { en: "LATEST", ar: "الأحدث" },
  title:    { en: "Promotions & Announcements", ar: "العروض والإعلانات" },
  lede: {
    en: "News, offers, and updates from Nasser Al Ali Enterprises.",
    ar: "أخبار وعروض وتحديثات من ناصر العلي للمقاولات.",
  },
});

console.log("\nDone.\n");
