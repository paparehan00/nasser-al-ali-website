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
    "nav.home":            "Home",
    "nav.services":        "Services",
    "nav.fleet":           "Fleet",
    "nav.projects":        "Projects",
    "nav.about":           "About",
    "nav.leadership":      "Leadership",
    "nav.certificationsAwards": "Certifications & Awards",
    "nav.gallery":         "Gallery",
    "nav.careers":         "Careers",
    "nav.promotions":      "Promotions",
    "nav.contact":         "Contact",

    "serviceDetail.scopeHeading": "What You Get",
    "serviceDetail.whyHeading":   "Why Nasser Al Ali Enterprises",

    "model3d.hint":         "Drag to rotate",
    "model3d.creditPrefix": "3D model by",
    "model3d.overline":     "INTERACTIVE 3D",
    "model3d.title":        "See the Equipment in 3D",

    "announce.view":     "View",
    "announce.dismiss":  "Dismiss",
    "announce.aria":     "Promotion announcement",
    "nav.sisterConcerns":  "Sister Concerns",
    "header.call":         "Call +974 5586 1100",
    "header.whatsapp":     "WhatsApp",

    // Mega menu column headings
    "megamenu.home.company":      "Company",
    "megamenu.home.work":         "What We Do",
    "megamenu.home.connect":      "Connect",
    "megamenu.services.core":     "Core Services",
    "megamenu.services.explore":  "Explore",
    "megamenu.projects.work":     "Our Work",
    "megamenu.projects.proof":    "Proof of Work",
    "megamenu.about.company":     "Company",
    "megamenu.about.more":        "More",
    "megamenu.about.credentials": "Credentials",
    "megamenu.gallery.explore":   "Explore",

    // Mega menu links
    "megamenu.link.overview":         "Company Overview",
    "megamenu.link.companyProfile":   "Company Profile",
    "megamenu.link.missionVision":    "Mission & Vision",
    "megamenu.link.leadership":       "Leadership Team",
    "megamenu.link.certifications":   "Certifications",
    "megamenu.link.services":         "Our Services",
    "megamenu.link.fleet":            "Fleet & Equipment",
    "megamenu.link.projects":         "Featured Projects",
    "megamenu.link.civil":            "Civil Works Gallery",
    "megamenu.link.awards":           "Awards & CSR",
    "megamenu.link.contact":          "Contact Us",
    "megamenu.link.manpower":         "Manpower Support",
    "megamenu.link.equipment":        "Equipment Support",
    "megamenu.link.civilSvc":         "Civil Contracting",
    "megamenu.link.mep":              "MEP Contracting",
    "megamenu.link.cleaning":         "Professional Cleaning",
    "megamenu.link.business":         "Business Center & Real Estate",
    "megamenu.link.allServices":      "View All Services",
    "home.viewAllProjects":           "View All Projects",
    "home.learnMoreAbout":            "More About Us",
    "megamenu.link.getQuote":         "Request a Quote",
    "megamenu.link.featuredProjects": "Featured Projects",
    "megamenu.link.civilGallery":     "Civil Works Gallery",
    "megamenu.link.fullGallery":      "Full Photo Gallery",
    "megamenu.link.clients":          "Trusted Clients",
    "megamenu.link.numbers":          "Company in Numbers",

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

    "companyProfile.overline": "COMPANY PROFILE",
    "companyProfile.title":    "Who We Are",
    "companyProfile.body":     "Nasser Al Ali Enterprises started in Qatar in 2005. Since then, we have grown into one of the country's most trusted contracting companies. We provide skilled manpower, reliable equipment, civil works, and support services to some of the biggest projects in Qatar. Our team works with care, safety, and honesty on every job, from small tasks to major developments. Download our full company profile below to see our history, our services, and our track record.",

    "missionVisionPage.overline": "MISSION & VISION",
    "missionVisionPage.title":    "What We Promise, Where We're Going",
    "missionVisionPage.intro":   "Nasser Al Ali Enterprises has worked on major projects across Qatar since 2005. From manpower and equipment to civil works and support services, we help our clients build with confidence. Our mission and vision guide everything we do, from the smallest task to the largest contract.",
    "missionVisionPage.missionHeading": "Our Mission",
    "missionVisionPage.missionBody": "Our mission is to give every client the people, equipment, and skills they need to finish their project the right way.\n\nWe provide skilled manpower for every kind of job, from general labour to trained technicians. We keep our equipment fleet reliable and ready, so work never stops for the wrong reasons. We do quality work the first time, not just work that passes today and fails tomorrow.\n\nSafety comes first on every site we touch. Our teams follow clear safety steps every day, because no project is worth a life or an injury. We also respect time. When we promise a delivery date, we work to meet it, because delays cost our clients money and trust.\n\nMost of all, we treat every client as a long-term partner, not a one-time job. We listen, we adjust, and we stay honest about what we can do and by when. This is how we have kept clients coming back to us for almost two decades.",
    "missionVisionPage.visionHeading": "Our Vision",
    "missionVisionPage.visionBody": "Our vision is to become one of the most trusted names in contracting and support services in Qatar.\n\nQatar is growing fast, and we want to grow with it. New buildings, new roads, and new communities all need partners who show up, do the work well, and keep their word. We want to be that partner for as many projects as we can.\n\nWe will not chase growth by cutting corners. As we take on bigger projects and more clients, we will keep the same standard of quality, safety, and honesty that built our name in the first place. Growing bigger only matters if we stay just as reliable.\n\nIn the years ahead, we plan to expand our services, strengthen our teams, and keep investing in better equipment and better training. Every step forward should make us more useful to our clients, not just more well known. That is the kind of company we are building.",

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
    "contact.form.preferredDate": "Preferred Date & Time (optional)",
    "contact.form.message":      "Message",
    "contact.form.messagePh":    "Tell us about your project…",
    "contact.form.consent":      "I have read and agree to the Privacy Policy. I understand my message will be stored so we can respond.",
    "contact.form.submit":       "Submit Enquiry",
    "contact.form.sending":      "Sending…",
    "contact.form.success":      "Thank you - we'll get back to you within one business day.",
    "contact.form.error":        "Sorry - the message didn't send. Please try again, or WhatsApp us at +974 5559 6774.",
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
    "footer.ctaMarquee":   "Let's Build Together",
    "footer.ctaHeading":   "Ready to start your project?",
    "footer.ctaButton":    "Get in Touch",
    "gallery.overline":        "VISUAL SHOWCASE",
    "gallery.title":           "Gallery",
    "gallery.lede":            "Explore our clients, landmark projects, and recognition milestones.",
    "gallery.clients":         "Our Clients",
    "gallery.clientsOverline": "TRUSTED PARTNERS",
    "gallery.clientsLede":     "43+ major clients across Qatar and the wider GCC.",
    "gallery.projects":        "Projects",
    "gallery.projectsOverline":"FEATURED PROJECTS",
    "gallery.projectsLede":    "Landmark projects that define Qatar's built environment.",
    "gallery.awardsCSR":       "Awards & CSR",
    "gallery.awardsOverline":  "RECOGNITION & COMMUNITY",
    "gallery.awardsLede":      "Awards, recognitions, and our commitment to community and sustainability.",
    "gallery.loading":         "Loading…",

    "sisterConcerns.overline":   "OUR GROUP",
    "sisterConcerns.title":      "Sister Concerns",
    "sisterConcerns.lede":       "Part of the Nasser Al Ali Enterprises group, sister companies extending our reach across related industries.",
    "sisterConcerns.comingSoon":"Details for our sister companies are being finalized and will appear here shortly. In the meantime, feel free to contact us for more information.",

    "careers.noOpenings":        "No current openings",
    "careers.noOpeningsBody":    "Check back soon, or send us your CV anyway. We're always interested in meeting good people.",
    "careers.sendGeneral":       "Send a general application",
    "careers.applyNow":          "Apply Now",
    "careers.typeLabel":         "Type",
    "careers.requirementsLabel": "Requirements",
    "careers.applyOverline":     "JOIN THE TEAM",
    "careers.applyTitle":        "Apply",
    "careers.applyGeneralTitle": "General Application",
    "careers.applyMessageLabel": "Tell us about yourself",
    "careers.applyMessagePh":    "A short note about your experience and why you'd like to join us.",
    "careers.applyCvLabel":      "Attach your CV (optional)",
    "careers.applyCvHint":       "PDF only, up to 5 MB.",
    "careers.applyCvRemove":     "Remove attached CV",
    "careers.applySubmit":       "Submit Application",
    "careers.applySending":      "Sending…",
    "careers.applySuccess":      "Your application has been received. A confirmation has been sent to your email.",

    "promotions.empty":     "Nothing posted right now",
    "promotions.emptyBody": "Check back soon for news, offers, and announcements.",

    "footer.weSupport":    "We Support",
    "footer.cookieSettings":"Cookie settings",
    "footer.privacy":      "Privacy Policy",
    "footer.terms":        "Terms of Use",
    "footer.cookies":      "Cookie Policy",
    "footer.home":         "Home",
    "footer.aboutUs":      "About Us",
    "footer.promotions":   "Promotions & Announcements",
    "footer.ourServices":  "Our Services",
    "footer.contactHeading":"Contact",
    "footer.officeHours":      "Office Hours",
    "footer.officeHoursValue": "Sun-Thu: 9:00 AM to 6:00 PM",
    "footer.blurb":        "Adding value to your business operations through skilled and ethical manpower, equipment and civil contracting, built on two decades of trust in Qatar.",

    "chat.launcher":       "Talk to our AI assistant",
    "cta.callAria":        "Call +974 5586 1100",
    "cta.whatsappAria":    "Chat on WhatsApp",
    "cta.backToTopAria":   "Back to top",
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
    "nav.home":            "الرئيسية",
    "nav.services":        "الخدمات",
    "nav.fleet":           "الأسطول",
    "nav.projects":        "المشاريع",
    "nav.about":           "عن الشركة",
    "nav.leadership":      "القيادة",
    "nav.certificationsAwards": "الشهادات والتكريم",
    "nav.gallery":         "المعرض",
    "nav.careers":         "الوظائف",
    "nav.promotions":      "العروض",
    "nav.contact":         "تواصل",

    "serviceDetail.scopeHeading": "ماذا تحصل عليه",
    "serviceDetail.whyHeading":   "لماذا ناصر العلي للمقاولات",

    "model3d.hint":         "اسحب للتدوير",
    "model3d.creditPrefix": "نموذج ثلاثي الأبعاد بواسطة",
    "model3d.overline":     "تفاعلي ثلاثي الأبعاد",
    "model3d.title":        "شاهد المعدات بتقنية ثلاثية الأبعاد",

    "announce.view":     "عرض",
    "announce.dismiss":  "إغلاق",
    "announce.aria":     "إعلان ترويجي",
    "nav.sisterConcerns":  "الشركات الشقيقة",
    "header.call":         "اتصل بنا +974 5586 1100",
    "header.whatsapp":     "واتساب",

    // Mega menu column headings
    "megamenu.home.company":      "الشركة",
    "megamenu.home.work":         "خدماتنا",
    "megamenu.home.connect":      "تواصل",
    "megamenu.services.core":     "الخدمات الأساسية",
    "megamenu.services.explore":  "المزيد",
    "megamenu.projects.work":     "أعمالنا",
    "megamenu.projects.proof":    "دليل الإنجاز",
    "megamenu.about.company":     "الشركة",
    "megamenu.about.more":        "المزيد",
    "megamenu.about.credentials": "الاعتمادات",
    "megamenu.gallery.explore":   "استكشف",

    // Mega menu links
    "megamenu.link.overview":         "نظرة عامة على الشركة",
    "megamenu.link.companyProfile":   "ملف الشركة",
    "megamenu.link.missionVision":    "الرسالة والرؤية",
    "megamenu.link.leadership":       "فريق القيادة",
    "megamenu.link.certifications":   "الشهادات",
    "megamenu.link.services":         "خدماتنا",
    "megamenu.link.fleet":            "الأسطول والمعدات",
    "megamenu.link.projects":         "المشاريع المميزة",
    "megamenu.link.civil":            "معرض الأعمال المدنية",
    "megamenu.link.awards":           "التكريم والمسؤولية",
    "megamenu.link.contact":          "تواصل معنا",
    "megamenu.link.manpower":         "توفير العمالة",
    "megamenu.link.equipment":        "دعم المعدات",
    "megamenu.link.civilSvc":         "المقاولات المدنية",
    "megamenu.link.mep":              "الأعمال الكهروميكانيكية",
    "megamenu.link.cleaning":         "التنظيف الاحترافي",
    "megamenu.link.business":         "مراكز الأعمال والعقارات",
    "megamenu.link.allServices":      "عرض جميع الخدمات",
    "home.viewAllProjects":           "عرض جميع المشاريع",
    "home.learnMoreAbout":            "المزيد عنا",
    "megamenu.link.getQuote":         "اطلب عرض سعر",
    "megamenu.link.featuredProjects": "المشاريع المميزة",
    "megamenu.link.civilGallery":     "معرض الأعمال المدنية",
    "megamenu.link.fullGallery":      "معرض الصور الكامل",
    "megamenu.link.clients":          "عملاء موثوقون",
    "megamenu.link.numbers":          "الشركة بالأرقام",

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

    "companyProfile.overline": "ملف الشركة",
    "companyProfile.title":    "من نحن",
    "companyProfile.body":     "بدأت ناصر العلي للمقاولات في قطر عام 2005. منذ ذلك الحين، نمت الشركة لتصبح واحدة من أكثر شركات المقاولات ثقة في البلاد. نوفر عمالة ماهرة ومعدات موثوقة وأعمالاً مدنية وخدمات دعم لبعض أكبر المشاريع في قطر. يعمل فريقنا بعناية وأمان ونزاهة في كل مهمة، من الأعمال الصغيرة إلى المشاريع الكبرى. حمّل ملف الشركة الكامل أدناه للاطلاع على تاريخنا وخدماتنا وسجلنا الحافل.",

    "missionVisionPage.overline": "الرسالة والرؤية",
    "missionVisionPage.title":    "ما نلتزم به، وإلى أين نتجه",
    "missionVisionPage.intro":   "تعمل ناصر العلي للمقاولات في مشاريع كبرى عبر قطر منذ عام 2005. من العمالة والمعدات إلى الأعمال المدنية وخدمات الدعم، نساعد عملاءنا على البناء بثقة. رسالتنا ورؤيتنا توجّه كل ما نقوم به، من أصغر مهمة إلى أكبر عقد.",
    "missionVisionPage.missionHeading": "مهمتنا",
    "missionVisionPage.missionBody": "مهمتنا أن نوفر لكل عميل الأشخاص والمعدات والمهارات التي يحتاجها لإنجاز مشروعه بالشكل الصحيح.\n\nنوفر عمالة ماهرة لكل نوع من الأعمال، من العمالة العامة إلى الفنيين المدرَّبين. نحافظ على جاهزية أسطول معداتنا وموثوقيته، حتى لا يتوقف العمل لأسباب لا داعي لها. ننجز العمل بجودة عالية من المرة الأولى، لا عملاً ينجح اليوم ويفشل غدًا.\n\nالسلامة أولاً في كل موقع نعمل فيه. تتبع فرقنا خطوات سلامة واضحة كل يوم، لأن لا مشروع يستحق حياة إنسان أو إصابته. كما نحترم الوقت. عندما نَعِد بتاريخ تسليم، نعمل على الوفاء به، لأن التأخير يكلّف عملاءنا المال والثقة.\n\nوالأهم من ذلك، نتعامل مع كل عميل كشريك على المدى الطويل، لا كعمل لمرة واحدة. نستمع، ونتكيّف، ونبقى صادقين حول ما يمكننا فعله ومتى. بهذه الطريقة حافظنا على عودة عملائنا إلينا منذ ما يقارب عقدين.",
    "missionVisionPage.visionHeading": "رؤيتنا",
    "missionVisionPage.visionBody": "رؤيتنا أن نصبح من أكثر الأسماء ثقة في قطاع المقاولات وخدمات الدعم في قطر.\n\nقطر تنمو بسرعة، ونريد أن ننمو معها. المباني الجديدة والطرق الجديدة والمجتمعات الجديدة كلها تحتاج إلى شركاء يحضرون وينجزون العمل جيدًا ويفون بوعدهم. نريد أن نكون ذلك الشريك لأكبر عدد ممكن من المشاريع.\n\nلن نسعى للنمو عن طريق اختصار الطريق. مع تولّينا مشاريع أكبر وعملاء أكثر، سنحافظ على نفس مستوى الجودة والسلامة والصدق الذي بنى اسمنا منذ البداية. النمو الأكبر لا قيمة له إلا إذا بقينا بنفس الموثوقية.\n\nفي السنوات القادمة، نخطط لتوسيع خدماتنا، وتقوية فرقنا، ومواصلة الاستثمار في معدات وتدريب أفضل. كل خطوة إلى الأمام يجب أن تجعلنا أكثر فائدة لعملائنا، لا أكثر شهرة فقط. هذا هو نوع الشركة التي نبنيها.",

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
    "contact.form.preferredDate": "التاريخ والوقت المفضّل (اختياري)",
    "contact.form.message":      "الرسالة",
    "contact.form.messagePh":    "أخبرنا عن مشروعك…",
    "contact.form.consent":      "لقد قرأت وأوافق على سياسة الخصوصية. أفهم أنه سيتم حفظ رسالتي حتى نتمكن من الرد.",
    "contact.form.submit":       "إرسال الاستفسار",
    "contact.form.sending":      "جارٍ الإرسال…",
    "contact.form.success":      "شكرًا لك - سنعاود التواصل معك خلال يوم عمل واحد.",
    "contact.form.error":        "عذرًا - لم يتم إرسال الرسالة. حاول مرة أخرى، أو راسلنا على واتساب +974 5559 6774.",
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
    "footer.ctaMarquee":   "لنبنِ معًا",
    "footer.ctaHeading":   "هل أنت مستعد لبدء مشروعك؟",
    "footer.ctaButton":    "تواصل معنا",
    "gallery.overline":        "عرض بصري",
    "gallery.title":           "معرض الصور",
    "gallery.lede":            "استعرض عملاءنا ومشاريعنا البارزة ومحطات التقدير.",
    "gallery.clients":         "عملاؤنا",
    "gallery.clientsOverline": "شركاء موثوقون",
    "gallery.clientsLede":     "أكثر من 43 عميلًا رئيسيًا في قطر ودول الخليج.",
    "gallery.projects":        "المشاريع",
    "gallery.projectsOverline":"مشاريع مميزة",
    "gallery.projectsLede":    "مشاريع بارزة تُحدد ملامح بيئة البناء في قطر.",
    "gallery.awardsCSR":       "التكريم والمسؤولية",
    "gallery.awardsOverline":  "التكريم والمجتمع",
    "gallery.awardsLede":      "جوائز وتقدير والتزامنا بالمجتمع والاستدامة.",
    "gallery.loading":         "جارٍ التحميل…",

    "sisterConcerns.overline":   "مجموعتنا",
    "sisterConcerns.title":      "الشركات الشقيقة",
    "sisterConcerns.lede":       "جزء من مجموعة ناصر العلي للمقاولات - شركات شقيقة توسّع حضورنا في قطاعات ذات صلة.",
    "sisterConcerns.comingSoon":"تفاصيل شركاتنا الشقيقة قيد الإعداد وستظهر هنا قريبًا. يمكنكم التواصل معنا للمزيد من المعلومات في هذه الأثناء.",

    "careers.noOpenings":        "لا توجد شواغر حاليًا",
    "careers.noOpeningsBody":    "تابعونا قريبًا، أو أرسلوا سيرتكم الذاتية على أي حال. نحن دائمًا مهتمون بالتعرف على الكفاءات الجيدة.",
    "careers.sendGeneral":       "إرسال طلب عام",
    "careers.applyNow":          "قدّم الآن",
    "careers.typeLabel":         "نوع الوظيفة",
    "careers.requirementsLabel": "المتطلبات",
    "careers.applyOverline":     "انضم إلى الفريق",
    "careers.applyTitle":        "تقديم طلب",
    "careers.applyGeneralTitle": "طلب عام",
    "careers.applyMessageLabel": "أخبرنا عن نفسك",
    "careers.applyMessagePh":    "نبذة قصيرة عن خبرتك وسبب رغبتك في الانضمام إلينا.",
    "careers.applyCvLabel":      "أرفق سيرتك الذاتية (اختياري)",
    "careers.applyCvHint":       "بصيغة PDF فقط، بحد أقصى 5 ميجابايت.",
    "careers.applyCvRemove":     "إزالة السيرة الذاتية المرفقة",
    "careers.applySubmit":       "إرسال الطلب",
    "careers.applySending":      "جارٍ الإرسال…",
    "careers.applySuccess":      "تم استلام طلبك. تم إرسال تأكيد إلى بريدك الإلكتروني.",

    "promotions.empty":     "لا يوجد شيء منشور حاليًا",
    "promotions.emptyBody": "تابعونا قريبًا للأخبار والعروض والإعلانات.",

    "footer.weSupport":    "ندعم",
    "footer.cookieSettings":"إعدادات الكوكيز",
    "footer.privacy":      "سياسة الخصوصية",
    "footer.terms":        "شروط الاستخدام",
    "footer.cookies":      "سياسة الكوكيز",
    "footer.home":         "الرئيسية",
    "footer.aboutUs":      "عن الشركة",
    "footer.promotions":   "العروض والإعلانات",
    "footer.ourServices":  "خدماتنا",
    "footer.contactHeading":"تواصل",
    "footer.officeHours":      "ساعات العمل",
    "footer.officeHoursValue": "الأحد-الخميس: 9:00 صباحًا حتى 6:00 مساءً",
    "footer.blurb":        "نضيف قيمة لعمليات أعمالكم من خلال عمالة ماهرة وأخلاقية، ومعدات، ومقاولات مدنية، مبنية على عقدين من الثقة في قطر.",

    "chat.launcher":       "تحدث مع مساعدنا الذكي",
    "cta.callAria":        "اتصل بنا +974 5586 1100",
    "cta.whatsappAria":    "تواصل عبر واتساب",
    "cta.backToTopAria":   "العودة إلى الأعلى",
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

// Wraps children with a local lang override without affecting the global
// document lang/dir. Used by LivePreview to render the section in EN or AR.
export function I18nOverride({ lang: overrideLang, children }) {
  const { t } = useI18n();
  const value = useMemo(
    () => ({ lang: overrideLang, t, setLang: () => {} }),
    [overrideLang, t]
  );
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}
