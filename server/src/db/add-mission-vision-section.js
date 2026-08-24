/**
 * Idempotent migration: provisions the "mission-vision" content_section row.
 * Singleton section (no items) — replaces Google Reviews on the Home page
 * scroll (Reviews already has its own /reviews page and stays there).
 * Copy is adapted from the company's own mission/vision statement on the
 * old site (nasseralalienterprises.com/about/visionnmission.html),
 * rewritten longer, plainer-English, and more confident per request.
 * Safe to run multiple times — skips if the section already exists.
 * Run: node src/db/add-mission-vision-section.js   (from server/)
 */
import "dotenv/config";
import { db } from "./connection.js";

const KEY = "mission-vision";

const existing = db.prepare("SELECT key FROM content_sections WHERE key = ?").get(KEY);
if (existing) {
  console.log(`  skip (exists) [${KEY}]`);
  process.exit(0);
}

db.prepare(`
  INSERT INTO content_sections (key, overline_en, overline_ar, title_en, title_ar, lede_en, lede_ar, extra)
  VALUES (@key, @overline_en, @overline_ar, @title_en, @title_ar, @lede_en, @lede_ar, @extra)
`).run({
  key: KEY,
  overline_en: "OUR COMMITMENT",
  overline_ar: "التزامنا",
  title_en: "Mission & Vision",
  title_ar: "الرسالة والرؤية",
  lede_en: "Two decades of engineering and construction in Qatar taught us one thing: trust is earned one delivered project at a time. Here is the standard behind every decision we make.",
  lede_ar: "علّمتنا عقدان من العمل في قطر درسًا واحدًا: الثقة تُكسب مشروعًا تلو الآخر. وهذا ما يوجّه كل قرار نتخذه.",
  extra: JSON.stringify({
    missionTitle: { en: "Our Mission", ar: "مهمتنا" },
    missionBody: {
      en: "Our mission is to deliver engineered solutions that perform - on specification, on programme and on budget. We deploy a 5,000+ technical workforce, an owner-operated plant-and-equipment fleet and integrated MEP capability under one accountable framework. Through method statements, site-specific risk assessments and daily QA/QC controls, we manage quality, safety and the environment at the point of work, not after it. We hold to schedule, because programme certainty is what lets our clients plan with confidence. Every client is a long-term engineering partner: we listen, we challenge, and we are precise about what we can deliver and by when.",
      ar: "مهمتنا واضحة: أن ننجز العمل بالشكل الصحيح، في الوقت المحدد، ونكسب ثقة كل عميل للمشروع القادم. نقيس نجاحنا بعدد العملاء الذين يعودون إلينا ويوصون بنا للآخرين. هذا يعني الالتزام بالمواعيد، والاهتمام بأدق التفاصيل، والتعامل مع كل مشروع، كبيرًا كان أم صغيرًا، بنفس الحرص والاحترام. نحن لا نختصر الطريق، ولا نقطع وعودًا لا نستطيع الوفاء بها. هكذا نمونا على مدى أكثر من عقدين، وهكذا سنواصل النمو.",
    },
    visionTitle: { en: "Our Vision", ar: "رؤيتنا" },
    visionBody: {
      en: "Our vision is to be Qatar's most trusted engineering and construction partner - the first name a developer or contractor calls when the brief is demanding. As the country's built environment advances, we grow alongside it: expanding into value engineering, digital delivery and sustainable construction methods, while investing in our people, plant and technical systems. Growth only matters if it raises the standard. Every larger project, new capability and technology adoption must make us safer, more reliable and more precise - not simply bigger. We are building an integrated group that sets the benchmark for engineering quality in the region, one landmark at a time.",
      ar: "نريد أن نكون الاسم الأول الذي يخطر ببال الناس عند التفكير في قطاع المقاولات في قطر. رؤيتنا أن نتصدر بالمهنية والنزاهة والعدل في كل علاقاتنا، مع عملائنا وشركائنا وفريقنا. لا نكتفي بتلبية التوقعات، بل نسعى لتجاوزها في كل مشروع. النمو الحقيقي يُبنى على الثقة الحقيقية، ونحن نبني الاثنين معًا، معلمًا بعد آخر.",
    },
    video: { webm: "", mp4: "", poster: "/assets/about-theme-2.jpg" },
  }),
});

console.log(`  added [${KEY}]`);
