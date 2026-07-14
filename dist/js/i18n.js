/* ==========================================================================
   Nasser Al Ali - Site-wide EN/AR i18n
   Reads localStorage.naa-lang, sets <html lang/dir>, applies translations
   to any element with [data-i18n], [data-i18n-placeholder], [data-i18n-aria].
   Injects a small EN/AR pill toggle into the header, and notifies the
   chatbot widget of language changes.
   ========================================================================== */
(function () {
  "use strict";

  const KEY = "naa-lang";
  const supported = ["en", "ar"];
  const DEFAULT = "en";

  const readLang = () => {
    try {
      const v = localStorage.getItem(KEY);
      return supported.includes(v) ? v : DEFAULT;
    } catch (_) { return DEFAULT; }
  };
  const writeLang = (v) => {
    try { localStorage.setItem(KEY, v); } catch (_) {}
  };

  // ---------------------------------------------------------------------------
  // Translation dictionary
  // Keys used by data-i18n / data-i18n-placeholder / data-i18n-aria attributes.
  // ---------------------------------------------------------------------------
  const T = {
    en: {
      // Nav
      "nav.services":        "Services",
      "nav.fleet":           "Fleet",
      "nav.projects":        "Projects",
      "nav.about":           "About",
      "nav.leadership":      "Leadership",
      "nav.certifications":  "Certifications",
      "nav.awards":          "Awards",
      "nav.contact":         "Contact",
      "header.call":         "Call +974 6655 7728",
      "header.whatsapp":     "WhatsApp",

      // Hero
      "hero.overline":       "EST. 2005 · DOHA, QATAR",
      "hero.title":          "Building Qatar's Landmarks Since 2005",
      "hero.subtitle":       "Civil contracting, MEP, skilled manpower and heavy-equipment support for the region's most demanding projects.",
      "hero.btnProposal":    "Request a Proposal",
      "hero.btnProjects":    "View Our Projects",
      "hero.scroll":         "Scroll to Explore",

      // Stats
      "stats.years":         "Years Established",
      "stats.workforce":     "Skilled Workforce",
      "stats.clients":       "Major Clients",
      "stats.divisions":     "Service Divisions",

      // Clients / Trusted-by
      "clients.overline":    "OUR CLIENTS",
      "clients.title":       "Trusted by Qatar's Leading Contractors",
      "clients.lede":        "A partial list of the international and regional firms we've supported on landmark projects across the country.",

      // Services
      "services.overline":   "OUR EXPERTISE",
      "services.title":      "Core Services",
      "services.lede":       "Six divisions, one accountable partner - from manpower to turnkey delivery.",
      "services.manpower.title":  "Manpower Support",
      "services.equipment.title": "Equipment Support",
      "services.civil.title":     "Civil Contracting",
      "services.mep.title":       "MEP Contracting",
      "services.cleaning.title":  "Professional Cleaning",
      "services.business.title":  "Business Center & Real Estate",

      // Fleet
      "fleet.overline":      "HEAVY EQUIPMENT",
      "fleet.title":         "Our Fleet",
      "fleet.lede":          "A modern, owner-operated fleet supporting civil, MEP and site-logistics work across Qatar and the wider GCC.",
      "fleet.towerCranes.title": "Tower Cranes",
      "fleet.excavators.title":  "Excavators & JCBs",
      "fleet.loaders.title":     "Wheel Loaders",
      "fleet.tippers.title":     "Tipper Trucks",
      "fleet.mixers.title":      "Concrete Mixers",
      "fleet.lifts.title":       "Boom & Scissor Lifts",

      // Projects
      "projects.overline":   "PORTFOLIO",
      "projects.title":      "Featured Projects",
      "projects.lede":       "A selection of landmark builds we've delivered or supported across Doha and beyond.",

      // Gallery
      "gallery.overline":    "CIVIL WORKS",
      "gallery.title":       "Civil Gallery",
      "gallery.lede":        "On-site photography from villa builds, substations, landscaping and infrastructure projects.",

      // About
      "about.overline":      "ABOUT US",
      "about.title":         "Two Decades of Building Qatar",
      "about.speak":         "Speak with our team",
      "about.download":      "Download Company Profile",

      // Chairman
      "chairman.overline":   "CHAIRMAN'S MESSAGE",
      "chairman.title":      "A word from our Chairman",
      "chairman.signoff":    "- Nasser Ali J.Z. Al Ali, Chairman",

      // Leadership
      "leadership.overline": "ORGANIZATION",
      "leadership.title":    "Our Leadership",
      "leadership.lede":     "The team steering Nasser Al Ali Enterprises day-to-day.",
      "leadership.chairman": "Chairman",
      "leadership.gm":       "General Manager",
      "leadership.hr":       "HR Manager",
      "leadership.admin":    "Admin Manager",
      "leadership.ops":      "Operations Manager",

      // Certifications
      "certs.overline":      "CREDENTIALS",
      "certs.title":         "Certifications",
      "certs.lede":          "Nasser Al Ali Enterprises operates under internationally recognised management systems. Certification is issued by Equalitas Certifications Limited (JAS-ANZ accredited). Click any certificate to view full size.",
      "certs.iso9001.title": "Quality Management System",
      "certs.iso14001.title":"Environmental Management System",
      "certs.ohsas.title":   "Occupational Health & Safety Management System",
      "certs.issuer":        "Equalitas Certifications Limited",
      "certs.note":          "Certificates on file are dated 2014. Please contact us to confirm current renewal status before any pre-qualification submission.",

      // Numbers
      "numbers.overline":    "BY THE NUMBERS",
      "numbers.title":       "Two decades of measurable growth",
      "numbers.lede":        "Where our people, projects and clients have taken us since 2005.",

      // Reviews
      "reviews.overline":    "OUR REPUTATION",
      "reviews.title":       "What our clients say",
      "reviews.lede":        "Verified reviews from clients and site teams on Google.",
      "reviews.readAll":     "Read all reviews on Google",

      // Awards
      "awards.overline":     "RECOGNITION",
      "awards.title":        "Employee Recognition & Awards",
      "awards.lede":         "Nasser Al Ali Enterprises honours the workers and staff whose dedication builds Qatar. The moments below capture our Chairman presenting long-service, safety and outstanding-performance recognition to team members across our sites and offices.",

      // Contact
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

      // Footer
      "footer.rights":       "&copy; 2026 Nasser Al Ali Enterprises, Qatar &middot; Commercial Registration [CR - to be provided] &middot; P.O. Box 13115, Doha, Qatar",
      "footer.cookieSettings":"Cookie settings",
      "footer.privacy":      "Privacy Policy",
      "footer.terms":        "Terms of Use",
      "footer.cookies":      "Cookie Policy",

      // Chatbot launcher (Task 3.3)
      "chat.launcher":       "Talk to our AI assistant",

      // Language toggle labels (for accessibility)
      "toggle.aria":         "Switch language",
    },

    ar: {
      "nav.services":        "الخدمات",
      "nav.fleet":           "الأسطول",
      "nav.projects":        "المشاريع",
      "nav.about":           "عن الشركة",
      "nav.leadership":      "القيادة",
      "nav.certifications":  "الشهادات",
      "nav.awards":          "التكريم",
      "nav.contact":         "تواصل",
      "header.call":         "اتصل بنا +974 6655 7728",
      "header.whatsapp":     "واتساب",

      "hero.overline":       "تأسست عام 2005 · الدوحة، قطر",
      "hero.title":          "نبني معالم قطر منذ عام 2005",
      "hero.subtitle":       "المقاولات المدنية، والأعمال الكهروميكانيكية، وتوفير العمالة الماهرة والمعدات الثقيلة لأصعب المشاريع في المنطقة.",
      "hero.btnProposal":    "اطلب عرض سعر",
      "hero.btnProjects":    "عرض مشاريعنا",
      "hero.scroll":         "مرّر للاستكشاف",

      "stats.years":         "سنوات من التأسيس",
      "stats.workforce":     "عامل ماهر",
      "stats.clients":       "عميل رئيسي",
      "stats.divisions":     "قطاعات الخدمة",

      "clients.overline":    "عملاؤنا",
      "clients.title":       "موثوق به من كبرى شركات المقاولات في قطر",
      "clients.lede":        "قائمة جزئية بأبرز الشركات الدولية والإقليمية التي دعمناها في مشاريع بارزة عبر البلاد.",

      "services.overline":   "خبراتنا",
      "services.title":      "خدماتنا الأساسية",
      "services.lede":       "ستة قطاعات متكاملة تحت مظلة شريك واحد مسؤول - من العمالة إلى التسليم بمفتاح اليد.",
      "services.manpower.title":  "توفير العمالة",
      "services.equipment.title": "دعم المعدات",
      "services.civil.title":     "المقاولات المدنية",
      "services.mep.title":       "الأعمال الكهروميكانيكية (MEP)",
      "services.cleaning.title":  "التنظيف الاحترافي",
      "services.business.title":  "مراكز الأعمال والعقارات",

      "fleet.overline":      "المعدات الثقيلة",
      "fleet.title":         "أسطولنا",
      "fleet.lede":          "أسطول حديث مملوك ومُشغَّل ذاتيًا يدعم الأعمال المدنية والكهروميكانيكية واللوجستيات الميدانية عبر قطر ودول الخليج.",
      "fleet.towerCranes.title": "الرافعات البرجية",
      "fleet.excavators.title":  "الحفارات والجرافات",
      "fleet.loaders.title":     "اللوادر ذات العجلات",
      "fleet.tippers.title":     "شاحنات القلاب",
      "fleet.mixers.title":      "خلاطات الخرسانة",
      "fleet.lifts.title":       "المصاعد المقصية والذراعية",

      "projects.overline":   "أعمالنا",
      "projects.title":      "مشاريع مختارة",
      "projects.lede":       "مجموعة من المعالم التي أنجزناها أو دعمنا تنفيذها عبر الدوحة وما يتجاوزها.",

      "gallery.overline":    "الأعمال المدنية",
      "gallery.title":       "معرض الأعمال المدنية",
      "gallery.lede":        "صور من المواقع لمشاريع الفلل والمحطات الفرعية وأعمال المناظر الطبيعية والبنية التحتية.",

      "about.overline":      "عن الشركة",
      "about.title":         "عقدان من بناء قطر",
      "about.speak":         "تحدّث مع فريقنا",
      "about.download":      "تحميل ملف الشركة",

      "chairman.overline":   "كلمة رئيس مجلس الإدارة",
      "chairman.title":      "كلمة من رئيس مجلس الإدارة",
      "chairman.signoff":    "- ناصر علي ج. ز. العلي، رئيس مجلس الإدارة",

      "leadership.overline": "الهيكل التنظيمي",
      "leadership.title":    "قيادتنا",
      "leadership.lede":     "الفريق الذي يقود ناصر العلي للمقاولات يوميًا.",
      "leadership.chairman": "رئيس مجلس الإدارة",
      "leadership.gm":       "المدير العام",
      "leadership.hr":       "مدير الموارد البشرية",
      "leadership.admin":    "المدير الإداري",
      "leadership.ops":      "مدير العمليات",

      "certs.overline":      "اعتماداتنا",
      "certs.title":         "الشهادات",
      "certs.lede":          "تعمل ناصر العلي للمقاولات وفق أنظمة إدارة معتمدة دوليًا. الشهادات صادرة عن Equalitas Certifications Limited (معتمدة من JAS-ANZ). انقر على أي شهادة لعرضها بالحجم الكامل.",
      "certs.iso9001.title": "نظام إدارة الجودة",
      "certs.iso14001.title":"نظام الإدارة البيئية",
      "certs.ohsas.title":   "نظام إدارة الصحة والسلامة المهنية",
      "certs.issuer":        "Equalitas Certifications Limited",
      "certs.note":          "الشهادات المسجّلة تعود إلى عام 2014. يُرجى التواصل معنا لتأكيد حالة التجديد قبل تقديم أي عرض تأهيل.",

      "numbers.overline":    "بالأرقام",
      "numbers.title":       "عقدان من النمو الملموس",
      "numbers.lede":        "قصة أرقام تُروى منذ عام 2005 - موظفون، مشاريع، وعملاء.",

      "reviews.overline":    "سُمعتنا",
      "reviews.title":       "ما يقوله عملاؤنا",
      "reviews.lede":        "مراجعات موثّقة من عملائنا وفرق العمل عبر خرائط جوجل.",
      "reviews.readAll":     "اقرأ جميع المراجعات على جوجل",

      "awards.overline":     "التكريم",
      "awards.title":        "تكريم الموظفين والجوائز",
      "awards.lede":         "تحرص ناصر العلي للمقاولات على تكريم العمال والموظفين الذين يُساهمون في بناء قطر. تعرض الصور أدناه لحظات من تكريم رئيس مجلس الإدارة لأعضاء الفريق تقديرًا لخدمتهم الطويلة، وسِجل السلامة، والأداء المتميّز عبر مواقعنا ومكاتبنا.",

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

      "footer.rights":       "&copy; 2026 ناصر العلي للمقاولات، قطر &middot; السجل التجاري [CR - سيتم توفيره] &middot; ص.ب 13115، الدوحة، قطر",
      "footer.cookieSettings":"إعدادات الكوكيز",
      "footer.privacy":      "سياسة الخصوصية",
      "footer.terms":        "شروط الاستخدام",
      "footer.cookies":      "سياسة الكوكيز",

      "chat.launcher":       "تحدث مع مساعدنا الذكي",

      "toggle.aria":         "تبديل اللغة",
    },
  };

  // ---------------------------------------------------------------------------
  // Apply translations
  // ---------------------------------------------------------------------------
  const applyTranslations = (lang) => {
    const dict = T[lang] || T.en;
    const html = document.documentElement;
    html.setAttribute("lang", lang);
    html.setAttribute("dir", lang === "ar" ? "rtl" : "ltr");
    html.classList.toggle("naa-rtl", lang === "ar");

    // Text content
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      if (dict[key] !== undefined) {
        // If the string contains &amp; / &middot; / &copy; entities we allow HTML
        if (/[&<]/.test(dict[key])) el.innerHTML = dict[key];
        else el.textContent = dict[key];
      }
    });
    // Placeholders
    document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
      const key = el.getAttribute("data-i18n-placeholder");
      if (dict[key] !== undefined) el.setAttribute("placeholder", dict[key]);
    });
    // aria-labels
    document.querySelectorAll("[data-i18n-aria]").forEach((el) => {
      const key = el.getAttribute("data-i18n-aria");
      if (dict[key] !== undefined) el.setAttribute("aria-label", dict[key]);
    });

    // Fire an event so other scripts (chatbot) can react
    window.dispatchEvent(new CustomEvent("naa-lang-change", { detail: { lang } }));
  };

  // ---------------------------------------------------------------------------
  // Language toggle UI - inserted into .header-actions
  // ---------------------------------------------------------------------------
  const buildToggle = () => {
    const actions = document.querySelector(".header-actions");
    if (!actions || actions.querySelector(".naa-lang-toggle")) return;

    const wrap = document.createElement("div");
    wrap.className = "naa-lang-toggle";
    wrap.setAttribute("role", "group");
    wrap.setAttribute("aria-label", "Switch language");
    wrap.innerHTML = `
      <button type="button" data-lang="en" class="naa-lang-toggle-btn" aria-pressed="true">EN</button>
      <button type="button" data-lang="ar" class="naa-lang-toggle-btn" aria-pressed="false">ع</button>
    `;
    // Insert BEFORE the mobile-menu-toggle if present, else at the end
    const mmt = actions.querySelector(".mobile-menu-toggle");
    if (mmt) actions.insertBefore(wrap, mmt);
    else actions.appendChild(wrap);

    wrap.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-lang]");
      if (!btn) return;
      const lang = btn.getAttribute("data-lang");
      if (!supported.includes(lang)) return;
      setLang(lang);
    });
  };

  const updateToggle = (lang) => {
    document.querySelectorAll(".naa-lang-toggle-btn").forEach((b) => {
      const active = b.getAttribute("data-lang") === lang;
      b.classList.toggle("active", active);
      b.setAttribute("aria-pressed", active ? "true" : "false");
    });
  };

  // Public setter
  const setLang = (lang) => {
    if (!supported.includes(lang)) return;
    writeLang(lang);
    applyTranslations(lang);
    updateToggle(lang);
  };

  // Public API
  window.NAAi18n = {
    get: readLang,
    set: setLang,
    has: (k) => k in (T[readLang()] || T.en),
    t: (k) => (T[readLang()] || T.en)[k],
  };

  // ---------------------------------------------------------------------------
  // Boot
  // ---------------------------------------------------------------------------
  const boot = () => {
    const lang = readLang();
    // Apply immediately (early, before other JS runs, minimises flash)
    applyTranslations(lang);
    buildToggle();
    updateToggle(lang);
  };

  // Run as soon as body exists (script is loaded with defer so DOM is ready)
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
