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
  lede_en: "Two decades of building in Qatar taught us one thing: trust is earned one project at a time. Here is what guides every decision we make.",
  lede_ar: "علّمتنا عقدان من العمل في قطر درسًا واحدًا: الثقة تُكسب مشروعًا تلو الآخر. وهذا ما يوجّه كل قرار نتخذه.",
  extra: JSON.stringify({
    missionTitle: { en: "Our Mission", ar: "مهمتنا" },
    missionBody: {
      en: "Our mission is simple: build it right, deliver it on time, and earn every client's trust for the next project. We measure our success by how many clients come back to us and how many recommend us to others. That means showing up on schedule, watching every detail, and treating every job, big or small, with the same care and respect. We do not cut corners. We do not make promises we cannot keep. This is how we have grown for over two decades, and it is how we will keep growing.",
      ar: "مهمتنا واضحة: أن ننجز العمل بالشكل الصحيح، في الوقت المحدد، ونكسب ثقة كل عميل للمشروع القادم. نقيس نجاحنا بعدد العملاء الذين يعودون إلينا ويوصون بنا للآخرين. هذا يعني الالتزام بالمواعيد، والاهتمام بأدق التفاصيل، والتعامل مع كل مشروع، كبيرًا كان أم صغيرًا، بنفس الحرص والاحترام. نحن لا نختصر الطريق، ولا نقطع وعودًا لا نستطيع الوفاء بها. هكذا نمونا على مدى أكثر من عقدين، وهكذا سنواصل النمو.",
    },
    visionTitle: { en: "Our Vision", ar: "رؤيتنا" },
    visionBody: {
      en: "We want to be the first name people think of when it comes to construction in Qatar. Our vision is to lead with professionalism, integrity, and fairness in every relationship, with our clients, our partners, and our own people. We do not just aim to meet expectations; we aim to go beyond them, project after project. Real growth is built on real trust, and we are building both, one landmark at a time.",
      ar: "نريد أن نكون الاسم الأول الذي يخطر ببال الناس عند التفكير في قطاع المقاولات في قطر. رؤيتنا أن نتصدر بالمهنية والنزاهة والعدل في كل علاقاتنا، مع عملائنا وشركائنا وفريقنا. لا نكتفي بتلبية التوقعات، بل نسعى لتجاوزها في كل مشروع. النمو الحقيقي يُبنى على الثقة الحقيقية، ونحن نبني الاثنين معًا، معلمًا بعد آخر.",
    },
    video: { webm: "", mp4: "", poster: "/assets/about-theme-2.jpg" },
  }),
});

console.log(`  added [${KEY}]`);
