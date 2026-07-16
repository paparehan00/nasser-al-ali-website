import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "naa-lang";
const SUPPORTED = ["en", "ar"];
const DEFAULT = "en";

// Translation dictionary - shared with the vanilla i18n.js of the old site.
export const T = {
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

    "hero.overline":       "EST. 2005 · DOHA, QATAR",
    "hero.title":          "Building Qatar's Landmarks Since 2005",
    "hero.subtitle":       "Civil contracting, MEP, skilled manpower and heavy-equipment support for the region's most demanding projects.",
    "hero.btnProposal":    "Request a Proposal",
    "hero.btnProjects":    "View Our Projects",
    "hero.scroll":         "Scroll to Explore",

    "stats.years":         "Years Established",
    "stats.workforce":     "Skilled Workforce",
    "stats.clients":       "Major Clients",
    "stats.divisions":     "Service Divisions",

    "clients.overline":    "OUR CLIENTS",
    "clients.title":       "Trusted by Qatar's Leading Contractors",
    "clients.lede":        "A partial list of the international and regional firms we've supported on landmark projects across the country.",

    "services.overline":   "OUR EXPERTISE",
    "services.title":      "Core Services",
    "services.lede":       "Six divisions, one accountable partner - from manpower to turnkey delivery.",
    "services.manpower.title":  "Manpower Support",
    "services.manpower.body":   "Skilled, reliable workforce for construction, maintenance and industrial operations across Qatar.",
    "services.equipment.title": "Equipment Support",
    "services.equipment.body":  "A modern heavy-equipment fleet with operators for excavation, lifting and site logistics.",
    "services.civil.title":     "Civil Contracting",
    "services.civil.body":      "Turnkey civil construction: substations, villas, landscaping and infrastructure.",
    "services.mep.title":       "MEP Contracting",
    "services.mep.body":        "Integrated mechanical, electrical and plumbing works for buildings and industrial facilities.",
    "services.cleaning.title":  "Professional Cleaning",
    "services.cleaning.body":   "Comprehensive commercial and post-construction cleaning services.",
    "services.business.title":  "Business Center & Real Estate",
    "services.business.body":   "Managed office space and real-estate solutions through our Nasser Al Ali Business Center and group real-estate arm.",

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

    "projects.overline":   "PORTFOLIO",
    "projects.title":      "Featured Projects",
    "projects.lede":       "A selection of landmark builds we've delivered or supported across Doha and beyond.",

    "gallery.overline":    "CIVIL WORKS",
    "gallery.title":       "Civil Gallery",
    "gallery.lede":        "On-site photography from villa builds, substations, landscaping and infrastructure projects.",

    "about.overline":      "ABOUT US",
    "about.title":         "Two Decades of Building Qatar",
    "about.body":          "Established in Qatar in 2005, Nasser Al Ali Enterprises has grown into one of the Middle East's most successful construction firms, with landmark civil, mechanical and electrical projects across Qatar - including the Doha Metro network, the National Museum of Qatar and Lusail City. Backed by a 5,000+ workforce and joint ventures with leading international contractors, we deliver complex projects at scale and to the highest standards.",
    "about.speak":         "Speak with our team",
    "about.download":      "Download Company Profile",

    "chairman.overline":   "CHAIRMAN'S MESSAGE",
    "chairman.title":      "A word from our Chairman",
    "chairman.p1":         "With a modest beginning as a manpower support services provider, Nasser Al Ali Enterprises has grown to its current position thanks to our team's commitment and the demand for quality services in Qatar's booming construction sector. Having built our company one block at a time, we established ourselves as one of the most sought-after service providers through our professionalism, dedication and commitment to work.",
    "chairman.p2":         "We know that delivering the results our clients need, when they need them, should never mean sacrificing quality. We place the utmost emphasis on our people, because we firmly believe a company is what its people are - a team of highly skilled, motivated individuals chosen for the right experience. Nasser Al Ali Enterprises is out to make a difference by setting examples.",
    "chairman.signoff":    "- Nasser Ali J.Z. Al Ali, Chairman",
    "chairman.name":       "Nasser Ali J.Z. Al Ali",
    "chairman.role":       "Chairman",

    "leadership.overline": "ORGANIZATION",
    "leadership.title":    "Our Leadership",
    "leadership.lede":     "The team steering Nasser Al Ali Enterprises day-to-day.",
    "leadership.chairman": "Chairman",
    "leadership.gm":       "General Manager",
    "leadership.hr":       "HR Manager",
    "leadership.admin":    "Admin Manager",
    "leadership.ops":      "Operations Manager",
    "leadership.tbd":      "-",

    "certs.overline":      "CREDENTIALS",
    "certs.title":         "Certifications",
    "certs.lede":          "Nasser Al Ali Enterprises operates under internationally recognised management systems. Certification is issued by Equalitas Certifications Limited (JAS-ANZ accredited). Click any certificate to view full size.",
    "certs.iso9001.title": "Quality Management System",
    "certs.iso14001.title":"Environmental Management System",
    "certs.ohsas.title":   "Occupational Health & Safety Management System",
    "certs.issuer":        "Equalitas Certifications Limited",

    "numbers.overline":    "BY THE NUMBERS",
    "numbers.title":       "Two decades of measurable growth",
    "numbers.lede":        "Where our people, projects and clients have taken us since 2005.",
    "numbers.workforceKicker": "Workforce · 2005 → 2026",
    "numbers.workforceTitle":  "From 50 to 5,000+ in 20 years",
    "numbers.workforceNote":   "Approximate figures across the Group. Sources: HR records & annual reviews.",
    "numbers.mixKicker":       "Workforce mix",
    "numbers.mixTitle":        "Skilled trades & specialists",
    "numbers.labour":          "Skilled labour",
    "numbers.mep":             "MEP technicians",
    "numbers.civil":           "Civil engineers & supervisors",
    "numbers.admin":           "Admin & management",
    "numbers.kpiClients":      "Major clients",
    "numbers.kpiClientsDetail":"Al Habtoor, Hyundai, J&P, Samsung C&T, Elegancia, Gulf Contracting, Midmac-TAV, Dogus-Onur & more.",
    "numbers.kpiGroup":        "Group companies",
    "numbers.kpiGroupDetail":  "A vertically-integrated ecosystem covering construction, MEP, real estate & support services.",
    "numbers.kpiYears":        "Years in Qatar",
    "numbers.kpiYearsDetail":  "Established 2005 · Doha, State of Qatar · continuous operations.",

    "reviews.overline":    "OUR REPUTATION",
    "reviews.title":       "What our clients say",
    "reviews.lede":        "Verified reviews from clients and site teams on Google.",
    "reviews.readAll":     "Read all reviews on Google",
    "reviews.gLabel":      "Reviews on Google",
    "reviews.basedOn":     "Based on",
    "reviews.reviews":     "reviews",

    "awards.overline":     "RECOGNITION & CSR",
    "awards.title":        "Awards & Corporate Social Responsibility",
    "awards.lede":         "Nasser Al Ali Enterprises honours the workers and staff whose dedication builds Qatar. The moments below capture our Chairman presenting long-service, safety and outstanding-performance recognition to team members across our sites and offices.",
    "awards.csr.title":    "Our commitment to people and community",
    "awards.csr.p1":       "We recognise and reward outstanding workers whose dedication and craftsmanship set the standard for every project we deliver.",
    "awards.csr.p2":       "Beyond recognition, we invest in employee welfare, safe working conditions and continuous training - because a company is only as strong as the people who build with it.",
    "awards.csr.p3":       "We are proud to contribute to the communities where we operate across Qatar, supporting local causes and creating stable, long-term opportunities for our workforce.",
    "awards.galleryTitle": "Recognition Moments",

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
    "services.manpower.body":   "عمالة ماهرة وموثوقة لأعمال البناء والصيانة والعمليات الصناعية في قطر.",
    "services.equipment.title": "دعم المعدات",
    "services.equipment.body":  "أسطول حديث من المعدات الثقيلة مع مشغّلين للحفر والرفع واللوجستيات الميدانية.",
    "services.civil.title":     "المقاولات المدنية",
    "services.civil.body":      "أعمال مدنية شاملة بمفتاح اليد: محطات فرعية، فلل، مناظر طبيعية، وبنية تحتية.",
    "services.mep.title":       "الأعمال الكهروميكانيكية (MEP)",
    "services.mep.body":        "أعمال ميكانيكية وكهربائية وسباكة متكاملة للمباني والمنشآت الصناعية.",
    "services.cleaning.title":  "التنظيف الاحترافي",
    "services.cleaning.body":   "خدمات تنظيف شاملة تجارية ومرحلة ما بعد البناء.",
    "services.business.title":  "مراكز الأعمال والعقارات",
    "services.business.body":   "خدمات مساحات مكتبية مُدارة وحلول عقارية من خلال مركز أعمال ناصر العلي وذراع العقارات في المجموعة.",

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

    "projects.overline":   "أعمالنا",
    "projects.title":      "مشاريع مختارة",
    "projects.lede":       "مجموعة من المعالم التي أنجزناها أو دعمنا تنفيذها عبر الدوحة وما يتجاوزها.",

    "gallery.overline":    "الأعمال المدنية",
    "gallery.title":       "معرض الأعمال المدنية",
    "gallery.lede":        "صور من المواقع لمشاريع الفلل والمحطات الفرعية وأعمال المناظر الطبيعية والبنية التحتية.",

    "about.overline":      "عن الشركة",
    "about.title":         "عقدان من بناء قطر",
    "about.body":          "تأسست في قطر عام 2005 لتصبح ناصر العلي للمقاولات من أنجح شركات البناء في الشرق الأوسط، بمشاريع مدنية وميكانيكية وكهربائية بارزة عبر قطر - بما فيها شبكة مترو الدوحة، ومتحف قطر الوطني، ومدينة لوسيل. مدعومة بأكثر من 5,000 عامل ومشاريع مشتركة مع كبرى شركات المقاولات الدولية، ننجز مشاريع معقّدة بأعلى المعايير.",
    "about.speak":         "تحدّث مع فريقنا",
    "about.download":      "تحميل ملف الشركة",

    "chairman.overline":   "كلمة رئيس مجلس الإدارة",
    "chairman.title":      "كلمة من رئيس مجلس الإدارة",
    "chairman.p1":         "بدايات متواضعة كمزود خدمات دعم العمالة، ونمت ناصر العلي للمقاولات لتصل إلى مكانتها الحالية بفضل التزام فريقنا والطلب على الخدمات عالية الجودة في قطاع البناء المزدهر في قطر. لبنة تلو أخرى، رسّخنا مكانتنا كأحد أكثر مزودي الخدمات طلبًا من خلال احترافيتنا وتفانينا والتزامنا بالعمل.",
    "chairman.p2":         "نعلم أن تقديم النتائج التي يحتاجها عملاؤنا، في الوقت الذي يحتاجونها فيه، لا يجب أن يعني أبدًا التضحية بالجودة. نضع الأولوية القصوى على موظفينا، لأننا نؤمن إيمانًا راسخًا بأن الشركة هي انعكاس لموظفيها - فريق من الأفراد المتحمسين ذوي المهارات العالية المختارين بالخبرة المناسبة. ناصر العلي للمقاولات ماضية في إحداث الفرق عبر تقديم النموذج.",
    "chairman.signoff":    "- ناصر علي ج. ز. العلي، رئيس مجلس الإدارة",
    "chairman.name":       "ناصر علي ج. ز. العلي",
    "chairman.role":       "رئيس مجلس الإدارة",

    "leadership.overline": "الهيكل التنظيمي",
    "leadership.title":    "قيادتنا",
    "leadership.lede":     "الفريق الذي يقود ناصر العلي للمقاولات يوميًا.",
    "leadership.chairman": "رئيس مجلس الإدارة",
    "leadership.gm":       "المدير العام",
    "leadership.hr":       "مدير الموارد البشرية",
    "leadership.admin":    "المدير الإداري",
    "leadership.ops":      "مدير العمليات",
    "leadership.tbd":      "-",

    "certs.overline":      "اعتماداتنا",
    "certs.title":         "الشهادات",
    "certs.lede":          "تعمل ناصر العلي للمقاولات وفق أنظمة إدارة معتمدة دوليًا. الشهادات صادرة عن Equalitas Certifications Limited (معتمدة من JAS-ANZ). انقر على أي شهادة لعرضها بالحجم الكامل.",
    "certs.iso9001.title": "نظام إدارة الجودة",
    "certs.iso14001.title":"نظام الإدارة البيئية",
    "certs.ohsas.title":   "نظام إدارة الصحة والسلامة المهنية",
    "certs.issuer":        "Equalitas Certifications Limited",

    "numbers.overline":    "بالأرقام",
    "numbers.title":       "عقدان من النمو الملموس",
    "numbers.lede":        "قصة أرقام تُروى منذ عام 2005 - موظفون، مشاريع، وعملاء.",
    "numbers.workforceKicker": "القوى العاملة · 2005 → 2026",
    "numbers.workforceTitle":  "من 50 إلى أكثر من 5,000 في 20 عامًا",
    "numbers.workforceNote":   "أرقام تقريبية على مستوى المجموعة. المصادر: سجلات الموارد البشرية والمراجعات السنوية.",
    "numbers.mixKicker":       "تركيبة القوى العاملة",
    "numbers.mixTitle":        "حرفيون مهرة ومتخصصون",
    "numbers.labour":          "العمالة الماهرة",
    "numbers.mep":             "فنيو الكهروميكانيك",
    "numbers.civil":           "مهندسو ومشرفو الأعمال المدنية",
    "numbers.admin":           "الإدارة والدعم",
    "numbers.kpiClients":      "عميل رئيسي",
    "numbers.kpiClientsDetail":"الحبتور، هيونداي، J&P، سامسونج C&T، إليغانسيا، جلف كونتراكتنج، ميدماك-تاف، دوغوس-أونور والمزيد.",
    "numbers.kpiGroup":        "شركات المجموعة",
    "numbers.kpiGroupDetail":  "منظومة متكاملة رأسيًا تشمل البناء والكهروميكانيك والعقارات وخدمات الدعم.",
    "numbers.kpiYears":        "سنة في قطر",
    "numbers.kpiYearsDetail":  "تأسست 2005 · الدوحة، دولة قطر · عمليات مستمرة.",

    "reviews.overline":    "سُمعتنا",
    "reviews.title":       "ما يقوله عملاؤنا",
    "reviews.lede":        "مراجعات موثّقة من عملائنا وفرق العمل عبر خرائط جوجل.",
    "reviews.readAll":     "اقرأ جميع المراجعات على جوجل",
    "reviews.gLabel":      "مراجعات على جوجل",
    "reviews.basedOn":     "استنادًا إلى",
    "reviews.reviews":     "مراجعة",

    "awards.overline":     "التكريم والمسؤولية الاجتماعية",
    "awards.title":        "التكريم والمسؤولية الاجتماعية للشركات",
    "awards.lede":         "تحرص ناصر العلي للمقاولات على تكريم العمال والموظفين الذين يُساهمون في بناء قطر. تعرض الصور أدناه لحظات من تكريم رئيس مجلس الإدارة لأعضاء الفريق تقديرًا لخدمتهم الطويلة، وسِجل السلامة، والأداء المتميّز عبر مواقعنا ومكاتبنا.",
    "awards.csr.title":    "التزامنا تجاه أفرادنا ومجتمعنا",
    "awards.csr.p1":       "نُكرّم ونُكافئ العمال المتميزين الذين يُجسّد تفانيهم ومهاراتهم المعيار الذي نلتزم به في كل مشروع.",
    "awards.csr.p2":       "بعيدًا عن التكريم، نستثمر في رفاهية الموظفين وبيئات العمل الآمنة والتدريب المستمر - لأن قوة الشركة من قوة أفرادها.",
    "awards.csr.p3":       "نفخر بمساهمتنا في المجتمعات التي نعمل فيها عبر قطر، ودعم القضايا المحلية، وخلق فرص عمل مستقرة وطويلة الأمد لكوادرنا.",
    "awards.galleryTitle": "لحظات التكريم",

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
