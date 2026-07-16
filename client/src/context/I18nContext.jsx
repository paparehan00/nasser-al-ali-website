import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "naa-lang";
const SUPPORTED = ["en", "ar"];
const DEFAULT = "en";

// Translation dictionary - module-local (was previously exported, which broke
// React Fast Refresh because the file exports both components and a plain
// object). Components consume it through the `t()` helper from useI18n().
//
// SCOPE: This dictionary now only holds UI chrome that is NOT managed by the
// admin CMS - nav labels, form fields, footer, chat, cookie/legal, and pages
// that aren't part of the 11 managed sections (Fleet, About, Leadership,
// Contact). All "managed section" content (Hero, Stats, Services, Clients,
// Projects, Gallery, Chairman, Certifications, Awards, Numbers, Reviews)
// lives in the SQLite `content_sections` / `content_items` tables and is
// fetched via /api/content/:key by the useContent() hook.
const T = {
  en: {
    "nav.services":        "Services",
    "nav.fleet":           "Fleet",
    "nav.projects":        "Projects",
    "nav.about":           "About",
    "nav.leadership":      "Leadership",
    "nav.certifications":  "Certifications",
    "nav.awards":          "Awards & CSR",
    "nav.reviews":         "Reviews",
    "nav.contact":         "Contact",
    "header.call":         "Call +974 6655 7728",
    "header.whatsapp":     "WhatsApp",

    "fleet.overline":      "HEAVY EQUIPMENT",
    "fleet.title":         "Our Fleet",
    "fleet.lede":          "A modern, owner-operated fleet supporting civil, MEP and site-logistics work across Qatar and the wider GCC.",
    "fleet.towerCranes.title": "Tower Cranes",
    "fleet.towerCranes.body":  "High-lift capacity for tower and mid-rise construction sites.",
    "fleet.excavators.title":  "Excavators & JCBs",
    "fleet.excavators.body":   "Tracked and wheeled excavators for foundation and earthworks.",
    "fleet.loaders.title":     "Wheel Loaders",
    "fleet.loaders.body":      "Front-end loaders for aggregate handling and site clearance.",
    "fleet.tippers.title":     "Tipper Trucks",
    "fleet.tippers.body":      "Bulk haulage for excavated material, aggregates and concrete.",
    "fleet.mixers.title":      "Concrete Mixers",
    "fleet.mixers.body":       "Transit mixers keeping pours on schedule for high-volume projects.",
    "fleet.lifts.title":       "Boom & Scissor Lifts",
    "fleet.lifts.body":        "Aerial work platforms for MEP, facade and finishing works at height.",

    "about.overline":      "ABOUT US",
    "about.title":         "Two Decades of Building Qatar",
    "about.body":          "Established in Qatar in 2005, Nasser Al Ali Enterprises has grown into one of the Middle East's most successful construction firms, with landmark civil, mechanical and electrical projects across Qatar - including the Doha Metro network, the National Museum of Qatar and Lusail City. Backed by a 5,000+ workforce and joint ventures with leading international contractors, we deliver complex projects at scale and to the highest standards.",
    "about.speak":         "Speak with our team",
    "about.download":      "Download Company Profile",

    "leadership.overline": "ORGANIZATION",
    "leadership.title":    "Our Leadership",
    "leadership.lede":     "The team steering Nasser Al Ali Enterprises day-to-day.",
    "leadership.chairman": "Chairman",
    "leadership.gm":       "General Manager",
    "leadership.hr":       "HR Manager",
    "leadership.admin":    "Admin Manager",
    "leadership.ops":      "Operations Manager",
    "leadership.tbd":      "-",

    "contact.overline":    "GET IN TOUCH",
    "contact.title":       "Get in Touch",
    "contact.lede":        "Book a consultation with our team.",
    "contact.book":        "Book a Consultation",
    "contact.formTitle":   "Send us a message",
    "contact.form.name":         "Name",
    "contact.form.namePh":       "Your full name",
    "contact.form.company":      "Company",
    "contact.form.companyPh":    "Company name",
    "contact.form.email":        "Email",
    "contact.form.emailPh":      "you@company.com",
    "contact.form.phone":        "Phone",
    "contact.form.phonePh":      "+974 …",
    "contact.form.service":      "Service Needed",
    "contact.form.servicePh":    "Select a service…",
    "contact.form.serviceManpower":  "Manpower Support",
    "contact.form.serviceEquipment": "Equipment Support",
    "contact.form.serviceCivil":     "Civil Contracting",
    "contact.form.serviceMep":       "MEP Contracting",
    "contact.form.serviceCleaning":  "Professional Cleaning",
    "contact.form.serviceBusiness":  "Business Center & Real Estate",
    "contact.form.message":      "Message",
    "contact.form.messagePh":    "Tell us about your project…",
    "contact.form.consent":      "I have read and agree to the Privacy Policy. I understand my message will be stored so we can respond.",
    "contact.form.submit":       "Submit Enquiry",
    "contact.form.sending":      "Sending…",
    "contact.form.success":      "Thank you - we'll get back to you within one business day.",
    "contact.form.error":        "Sorry - the message didn't send. Please try again, or WhatsApp us at +974 6655 7728.",
    "contact.info.office":       "Head Office",
    "contact.info.phone":        "Phone",
    "contact.info.email":        "Email & Web",
    "contact.callNow":           "Call Now",
    "contact.map.title":         "Nasser Al Ali Enterprises - Salwa Road, Building-155, Zone 43, Doha, Qatar",
    "contact.map.consent":       "Our office map (Google Maps) loads only after you accept third-party embeds.",
    "contact.map.manage":        "Manage cookie preferences",
    "contact.map.open":          "Or open in Google Maps →",

    "footer.slogan":       "Two decades of raising Qatar's skyline.",
    "footer.tag":          "Safely, on time, at scale.",
    "footer.rights":       "© 2026 Nasser Al Ali Enterprises, Qatar · P.O. Box 13115, Doha, Qatar",
    "footer.cookieSettings":"Cookie settings",
    "footer.privacy":      "Privacy Policy",
    "footer.terms":        "Terms of Use",
    "footer.cookies":      "Cookie Policy",
    "footer.home":         "Home",

    "chat.launcher":       "Talk to our AI assistant",
    "cta.callAria":        "Call +974 6655 7728",
    "cta.whatsappAria":    "Chat on WhatsApp",
    "toggle.aria":         "Switch language",

    "preloader.loading":   "Loading",

    "legal.freshness":     "Up to industry standards @ 2026",
    "legal.crumb.privacy": "Privacy Policy",
    "legal.crumb.terms":   "Terms of Use",
    "legal.crumb.cookies": "Cookie Policy",
    "legal.title.privacy": "Privacy Policy",
    "legal.title.terms":   "Terms of Use",
    "legal.title.cookies": "Cookie Policy",
  },

  ar: {
    "nav.services":        "الخدمات",
    "nav.fleet":           "الأسطول",
    "nav.projects":        "المشاريع",
    "nav.about":           "عن الشركة",
    "nav.leadership":      "القيادة",
    "nav.certifications":  "الشهادات",
    "nav.awards":          "التكريم والمسؤولية",
    "nav.reviews":         "التقييمات",
    "nav.contact":         "تواصل",
    "header.call":         "اتصل بنا +974 6655 7728",
    "header.whatsapp":     "واتساب",

    "fleet.overline":      "المعدات الثقيلة",
    "fleet.title":         "أسطولنا",
    "fleet.lede":          "أسطول حديث مملوك ومُشغَّل ذاتيًا يدعم الأعمال المدنية والكهروميكانيكية واللوجستيات الميدانية عبر قطر ودول الخليج.",
    "fleet.towerCranes.title": "الرافعات البرجية",
    "fleet.towerCranes.body":  "قدرة رفع عالية لمواقع الأبراج والبناء المتوسط الارتفاع.",
    "fleet.excavators.title":  "الحفارات والجرافات",
    "fleet.excavators.body":   "حفارات مجنزرة وذات عجلات لأعمال الأساسات والحفر.",
    "fleet.loaders.title":     "اللوادر ذات العجلات",
    "fleet.loaders.body":      "لوادر أمامية لمعالجة الركام وتنظيف المواقع.",
    "fleet.tippers.title":     "شاحنات القلاب",
    "fleet.tippers.body":      "نقل بالجملة للمواد المحفورة والركام والخرسانة.",
    "fleet.mixers.title":      "خلاطات الخرسانة",
    "fleet.mixers.body":       "خلاطات نقل للحفاظ على جدول الصب في المشاريع الكبيرة.",
    "fleet.lifts.title":       "المصاعد المقصية والذراعية",
    "fleet.lifts.body":        "منصات عمل جوية لأعمال الكهروميكانيك والواجهات والتشطيبات على ارتفاع.",

    "about.overline":      "عن الشركة",
    "about.title":         "عقدان من بناء قطر",
    "about.body":          "تأسست في قطر عام 2005 لتصبح ناصر العلي للمقاولات من أنجح شركات البناء في الشرق الأوسط، بمشاريع مدنية وميكانيكية وكهربائية بارزة عبر قطر - بما فيها شبكة مترو الدوحة، ومتحف قطر الوطني، ومدينة لوسيل. مدعومة بأكثر من 5,000 عامل ومشاريع مشتركة مع كبرى شركات المقاولات الدولية، ننجز مشاريع معقّدة بأعلى المعايير.",
    "about.speak":         "تحدّث مع فريقنا",
    "about.download":      "تحميل ملف الشركة",

    "leadership.overline": "الهيكل التنظيمي",
    "leadership.title":    "قيادتنا",
    "leadership.lede":     "الفريق الذي يقود ناصر العلي للمقاولات يوميًا.",
    "leadership.chairman": "رئيس مجلس الإدارة",
    "leadership.gm":       "المدير العام",
    "leadership.hr":       "مدير الموارد البشرية",
    "leadership.admin":    "المدير الإداري",
    "leadership.ops":      "مدير العمليات",
    "leadership.tbd":      "-",

    "contact.overline":    "تواصل معنا",
    "contact.title":       "تواصل معنا",
    "contact.lede":        "احجز استشارة مع فريقنا.",
    "contact.book":        "احجز استشارة",
    "contact.formTitle":   "أرسل لنا رسالة",
    "contact.form.name":         "الاسم",
    "contact.form.namePh":       "اسمك بالكامل",
    "contact.form.company":      "الشركة",
    "contact.form.companyPh":    "اسم الشركة",
    "contact.form.email":        "البريد الإلكتروني",
    "contact.form.emailPh":      "you@company.com",
    "contact.form.phone":        "الهاتف",
    "contact.form.phonePh":      "+974 …",
    "contact.form.service":      "الخدمة المطلوبة",
    "contact.form.servicePh":    "اختر خدمة…",
    "contact.form.serviceManpower":  "توفير العمالة",
    "contact.form.serviceEquipment": "دعم المعدات",
    "contact.form.serviceCivil":     "المقاولات المدنية",
    "contact.form.serviceMep":       "الأعمال الكهروميكانيكية",
    "contact.form.serviceCleaning":  "التنظيف الاحترافي",
    "contact.form.serviceBusiness":  "مراكز الأعمال والعقارات",
    "contact.form.message":      "الرسالة",
    "contact.form.messagePh":    "أخبرنا عن مشروعك…",
    "contact.form.consent":      "لقد قرأت وأوافق على سياسة الخصوصية. أفهم أنه سيتم حفظ رسالتي حتى نتمكن من الرد.",
    "contact.form.submit":       "إرسال الاستفسار",
    "contact.form.sending":      "جارٍ الإرسال…",
    "contact.form.success":      "شكرًا لك - سنعاود التواصل معك خلال يوم عمل واحد.",
    "contact.form.error":        "عذرًا - لم يتم إرسال الرسالة. حاول مرة أخرى، أو راسلنا على واتساب +974 6655 7728.",
    "contact.info.office":       "المكتب الرئيسي",
    "contact.info.phone":        "الهاتف",
    "contact.info.email":        "البريد الإلكتروني والموقع",
    "contact.callNow":           "اتصل الآن",
    "contact.map.title":         "ناصر العلي للمقاولات - طريق سلوى، مبنى 155، منطقة 43، الدوحة، قطر",
    "contact.map.consent":       "تُحمّل خريطة مكتبنا (خرائط جوجل) فقط بعد قبول عمليات التضمين من طرف ثالث.",
    "contact.map.manage":        "إدارة تفضيلات ملفات تعريف الارتباط",
    "contact.map.open":          "أو افتح في خرائط جوجل →",

    "footer.slogan":       "عقدان من رفع سماء قطر.",
    "footer.tag":          "بأمان، في الوقت المحدد، وعلى نطاق واسع.",
    "footer.rights":       "© 2026 ناصر العلي للمقاولات، قطر · ص.ب 13115، الدوحة، قطر",
    "footer.cookieSettings":"إعدادات الكوكيز",
    "footer.privacy":      "سياسة الخصوصية",
    "footer.terms":        "شروط الاستخدام",
    "footer.cookies":      "سياسة الكوكيز",
    "footer.home":         "الرئيسية",

    "chat.launcher":       "تحدث مع مساعدنا الذكي",
    "cta.callAria":        "اتصل بنا +974 6655 7728",
    "cta.whatsappAria":    "تواصل عبر واتساب",
    "toggle.aria":         "تبديل اللغة",

    "preloader.loading":   "جارٍ التحميل",

    "legal.freshness":     "مواكِبٌ لمعايير الصناعة @ 2026",
    "legal.crumb.privacy": "سياسة الخصوصية",
    "legal.crumb.terms":   "شروط الاستخدام",
    "legal.crumb.cookies": "سياسة الكوكيز",
    "legal.title.privacy": "سياسة الخصوصية",
    "legal.title.terms":   "شروط الاستخدام",
    "legal.title.cookies": "سياسة الكوكيز",
  },
};

const readInitial = () => {
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    return SUPPORTED.includes(v) ? v : DEFAULT;
  } catch (_) {
    return DEFAULT;
  }
};

const I18nContext = createContext({
  lang: DEFAULT,
  t: (k) => k,
  setLang: () => {},
});

export function I18nProvider({ children }) {
  const [lang, setLangState] = useState(readInitial);

  useEffect(() => {
    const html = document.documentElement;
    html.setAttribute("lang", lang);
    html.setAttribute("dir", lang === "ar" ? "rtl" : "ltr");
    html.classList.toggle("naa-rtl", lang === "ar");
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch (_) {}
    // Notify any non-React code (chatbot session storage etc.)
    window.dispatchEvent(new CustomEvent("naa-lang-change", { detail: { lang } }));
  }, [lang]);

  const setLang = useCallback((next) => {
    if (SUPPORTED.includes(next)) setLangState(next);
  }, []);

  const t = useCallback(
    (key) => {
      const dict = T[lang] || T.en;
      return dict[key] != null ? dict[key] : T.en[key] != null ? T.en[key] : key;
    },
    [lang]
  );

  const value = useMemo(() => ({ lang, t, setLang }), [lang, t, setLang]);
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  return useContext(I18nContext);
}
