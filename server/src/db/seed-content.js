// Seeds `content_sections` and `content_items` with the exact strings /
// image paths that are currently hardcoded in the client. Idempotent: a
// section is fully replaced (items wiped + reinserted) on every run so this
// is safe to re-run whenever the source-of-truth wants to be re-baselined
// before real admin edits happen.

import { db } from "./connection.js";

const upsertSection = db.prepare(`
  INSERT INTO content_sections (key, overline_en, overline_ar, title_en, title_ar, lede_en, lede_ar, extra)
  VALUES (@key, @overline_en, @overline_ar, @title_en, @title_ar, @lede_en, @lede_ar, @extra)
  ON CONFLICT(key) DO UPDATE SET
    overline_en = excluded.overline_en,
    overline_ar = excluded.overline_ar,
    title_en    = excluded.title_en,
    title_ar    = excluded.title_ar,
    lede_en     = excluded.lede_en,
    lede_ar     = excluded.lede_ar,
    extra       = excluded.extra,
    updated_at  = unixepoch()
`);

const wipeItems = db.prepare(`DELETE FROM content_items WHERE section_key = ?`);
const insertItem = db.prepare(`
  INSERT INTO content_items (section_key, sort_order, image_path, data)
  VALUES (?, ?, ?, ?)
`);

function seed({ key, overline, title, lede, extra, items = [] }) {
  const params = {
    key,
    overline_en: overline?.en ?? null,
    overline_ar: overline?.ar ?? null,
    title_en: title?.en ?? null,
    title_ar: title?.ar ?? null,
    lede_en: lede?.en ?? null,
    lede_ar: lede?.ar ?? null,
    extra: JSON.stringify(extra ?? {}),
  };
  const tx = db.transaction(() => {
    upsertSection.run(params);
    wipeItems.run(key);
    items.forEach((it, i) => {
      insertItem.run(key, it.sortOrder ?? i, it.imagePath ?? null, JSON.stringify(it.data ?? {}));
    });
  });
  tx();
  console.log(`  ${key}: ${items.length} item(s)`);
}

console.log("Seeding managed sections:");

seed({
  key: "hero",
  title: { en: "Building Qatar's Landmarks Since 2005", ar: "نبني معالم قطر منذ عام 2005" },
  lede: {
    en: "Civil contracting, MEP, skilled manpower and heavy-equipment support for the region's most demanding projects.",
    ar: "المقاولات المدنية، والأعمال الكهروميكانيكية، وتوفير العمالة الماهرة والمعدات الثقيلة لأصعب المشاريع في المنطقة.",
  },
  extra: {
    btnProposal: { en: "Request a Proposal", ar: "اطلب عرض سعر" },
    btnProjects: { en: "View Our Projects", ar: "عرض مشاريعنا" },
    scroll: { en: "Scroll to Explore", ar: "مرّر للاستكشاف" },
    video: { webm: "/assets/hero-1080.webm", mp4: "/assets/hero-1080.mp4", poster: "/assets/hero-poster.jpg" },
  },
});

seed({
  key: "stats",
  items: [
    { data: { target: 21,   plus: false, label: { en: "Years Established", ar: "سنوات من التأسيس" } } },
    { data: { target: 5000, plus: true,  label: { en: "Skilled Workforce", ar: "عامل ماهر" } } },
    { data: { target: 43,   plus: true,  label: { en: "Major Clients",     ar: "عميل رئيسي" } } },
    { data: { target: 6,    plus: false, label: { en: "Service Divisions", ar: "قطاعات الخدمة" } } },
  ],
});

seed({
  key: "services",
  overline: { en: "OUR EXPERTISE", ar: "خبراتنا" },
  title: { en: "Core Services", ar: "خدماتنا الأساسية" },
  lede: {
    en: "One accountable partner across the full project lifecycle - technical manpower, plant & equipment, civil construction and integrated MEP systems, from site mobilisation to final handover.",
    ar: "ستة قطاعات متكاملة تحت مظلة شريك واحد مسؤول - من العمالة إلى التسليم بمفتاح اليد.",
  },
  items: [
    { imagePath: "/assets/services/manpower-support.webp",   data: { id: "manpower",  alt: "Site team of skilled workers at a Qatar industrial project",       title: { en: "Manpower Support",              ar: "توفير العمالة" },       body: { en: "Certified technical manpower for construction, maintenance and industrial works - skilled trades, plant operators and supervisors, supplied, trained and managed on site.",                               ar: "عمالة ماهرة وموثوقة لأعمال البناء والصيانة والعمليات الصناعية في قطر." } } },
    { imagePath: "/assets/services/equipment-support.webp",  data: { id: "equipment", alt: "Heavy equipment fleet on a Qatar construction site",               title: { en: "Equipment Support",             ar: "دعم المعدات" },         body: { en: "A modern heavy plant and equipment fleet with trained operators - excavation, lifting, earthworks and site logistics, maintained for on-schedule delivery.",                                                        ar: "أسطول حديث من المعدات الثقيلة مع مشغّلين للحفر والرفع واللوجستيات الميدانية." } } },
    { imagePath: "/assets/services/civil-contracting.webp",  data: { id: "civil",     alt: "Civil contracting works in progress with backhoe and site team",   title: { en: "Civil Contracting",             ar: "المقاولات المدنية" },   body: { en: "Turnkey civil construction and infrastructure - substations, villas, roads, utilities and landscaping, delivered from design coordination to handover under one contract.",                                           ar: "أعمال مدنية شاملة بمفتاح اليد: محطات فرعية، فلل، مناظر طبيعية، وبنية تحتية." } } },
    { imagePath: "/assets/services/mep-contracting.webp",    data: { id: "mep",       alt: "MEP installation with ductwork and fire piping in a commercial building", title: { en: "MEP Contracting",         ar: "الأعمال الكهروميكانيكية (MEP)" }, body: { en: "Design, installation and maintenance of integrated MEP systems - HVAC, power, plumbing, drainage and fire safety - for buildings and industrial facilities.",                        ar: "أعمال ميكانيكية وكهربائية وسباكة متكاملة للمباني والمنشآت الصناعية." } } },
    { imagePath: "/assets/services/professional-cleaning.webp", data: { id: "cleaning", alt: "Industrial floor-cleaning operation",                             title: { en: "Professional Cleaning",         ar: "التنظيف الاحترافي" },   body: { en: "Commercial and post-construction cleaning - safe removal of construction dust, debris and residue to a client-ready specification before handover.",                                                   ar: "خدمات تنظيف شاملة تجارية ومرحلة ما بعد البناء." } } },
    { imagePath: "/assets/services/business-center.webp",    data: { id: "business",  alt: "Business Center and real estate services",                          title: { en: "Business Center & Real Estate", ar: "مراكز الأعمال والعقارات" }, body: { en: "Managed office space and real-estate solutions through Nasser Al Ali Business Center and the group's property arm - support for business set-up and local operations in Qatar.",                            ar: "خدمات مساحات مكتبية مُدارة وحلول عقارية من خلال مركز أعمال ناصر العلي وذراع العقارات في المجموعة." } } },
  ],
});

seed({
  key: "clients",
  overline: { en: "OUR CLIENTS", ar: "عملاؤنا" },
  title: { en: "Trusted by Qatar's Leading Contractors", ar: "موثوق به من كبرى شركات المقاولات في قطر" },
  lede: {
    en: "A partial list of the international and regional firms we've supported on landmark projects across the country.",
    ar: "قائمة جزئية بأبرز الشركات الدولية والإقليمية التي دعمناها في مشاريع بارزة عبر البلاد.",
  },
  items: [
    { imagePath: "/assets/alhabtoor.png",     data: { name: "Al Habtoor" } },
    { imagePath: "/assets/hyundai.png",       data: { name: "Hyundai" } },
    { imagePath: "/assets/j-n-p.png",         data: { name: "J&P" } },
    { imagePath: "/assets/arabtec.png",       data: { name: "Arabtec" } },
    { imagePath: "/assets/midmac.png",        data: { name: "Midmac" } },
    { imagePath: "/assets/six-construct.png", data: { name: "Six Construct" } },
    { imagePath: "/assets/shapoorji.png",     data: { name: "Shapoorji" } },
    { imagePath: "/assets/china-harbor.png",  data: { name: "China Harbor" } },
    { imagePath: "/assets/simplex.png",       data: { name: "Simplex" } },
    { imagePath: "/assets/redco.png",         data: { name: "Redco" } },
    { imagePath: "/assets/sino.png",          data: { name: "Sino" } },
    { imagePath: "/assets/gulfar.png",        data: { name: "Gulfar" } },
    { imagePath: "/assets/adcc.png",          data: { name: "ADCC" } },
    { imagePath: "/assets/hbk.png",           data: { name: "HBK" } },
    { imagePath: "/assets/ramco.png",         data: { name: "Ramco" } },
    { imagePath: "/assets/hkh.png",           data: { name: "HKH" } },
    { imagePath: "/assets/aljabor.png",       data: { name: "Al Jabor" } },
    { imagePath: "/assets/qbc.png",           data: { name: "QBC" } },
    { imagePath: "/assets/powerline.png",     data: { name: "Powerline" } },
    { imagePath: "/assets/ict.png",           data: { name: "ICT" } },
    { imagePath: "/assets/noors.png",         data: { name: "Noors" } },
    { imagePath: "/assets/yuksel.png",        data: { name: "Yuksel" } },
    { imagePath: "/assets/kg.png",            data: { name: "KG" } },
    { imagePath: "/assets/talal.png",         data: { name: "Talal" } },
    { imagePath: "/assets/classical-palace.png", data: { name: "Classical Palace" } },
    { imagePath: "/assets/eta.png",           data: { name: "ETA" } },
    { imagePath: "/assets/marbu.png",         data: { name: "Marbu" } },
    { imagePath: "/assets/shannon.png",       data: { name: "Shannon" } },
    { imagePath: "/assets/arabian-specialised-materials.png", data: { name: "Arabian Specialised Materials" } },
    { imagePath: "/assets/builders-advanced.png", data: { name: "Builders Advanced" } },
    { imagePath: "/assets/dogus-onur-jv.png", data: { name: "Dogus-Onur JV" } },
    { imagePath: "/assets/elegancia.png",     data: { name: "Elegancia" } },
    { imagePath: "/assets/gulf-asia-contracting.png", data: { name: "Gulf Asia Contracting" } },
    { imagePath: "/assets/gulf-contracting-company.png", data: { name: "Gulf Contracting Company" } },
    { imagePath: "/assets/iris-construction.png", data: { name: "Iris Construction" } },
    { imagePath: "/assets/midmac-tav-jv.png", data: { name: "Midmac-TAV JV" } },
    { imagePath: "/assets/teyseer.png",       data: { name: "Teyseer" } },
    { imagePath: "/assets/ucc-infraroad-limak-jv.png", data: { name: "UCC InfraRoad Limak JV" } },
    { imagePath: "/assets/china-eleventh-chemical.png", data: { name: "China Eleventh Chemical" } },
    { imagePath: "/assets/inco-industrial-duqm.png", data: { name: "INCO Industrial Duqm" } },
    { imagePath: "/assets/vito-engineering.png", data: { name: "Vito Engineering" } },
    { imagePath: "/assets/bahadir-construction.png", data: { name: "Bahadir Construction" } },
    { imagePath: "/assets/qatar-maid-service.png", data: { name: "Qatar Maid Service" } },
  ],
});

seed({
  key: "projects",
  overline: { en: "PORTFOLIO", ar: "أعمالنا" },
  title: { en: "Featured Projects", ar: "مشاريع مختارة" },
  lede: {
    en: "A selection of landmark projects we have delivered or supported across Doha and beyond - high-rise towers, residential developments, educational buildings and civil infrastructure works.",
    ar: "مجموعة من المعالم التي أنجزناها أو دعمنا تنفيذها عبر الدوحة وما يتجاوزها.",
  },
  items: [
    { imagePath: "/assets/3d_2.jpeg",  data: { name: "Dareen Tower",             location: "Dafna",       featured: true } },
    { imagePath: "/assets/3d_5.jpeg",  data: { name: "Qanat Quartier",           location: "Pearl Qatar" } },
    { imagePath: "/assets/3d_4.jpeg",  data: { name: "Barwa Village",            location: "Wakra" } },
    { imagePath: "/assets/3d_7.jpeg",  data: { name: "75 Villas",                location: "Ain Khalid" } },
    { imagePath: "/assets/3d_10.jpeg", data: { name: "Twin Tower",               location: "Abdul Aziz" } },
    { imagePath: "/assets/3d_8.jpeg",  data: { name: "Business Park & Hotel",    location: "Najma" } },
    { imagePath: "/assets/3d_11.jpeg", data: { name: "Madina Centrale",          location: "Pearl Qatar" } },
    { imagePath: "/assets/3d_6.jpeg",  data: { name: "Residential Bldg 12 & 14", location: "Pearl Qatar" } },
    { imagePath: "/assets/3d_9.jpeg",  data: { name: "Hamad Bin Hanbal School",  location: "Najma" } },
    { imagePath: "/assets/3d_3.jpeg",  data: { name: "Lusail Project",           location: "Lusail" } },
  ],
});

seed({
  key: "gallery",
  overline: { en: "CIVIL WORKS", ar: "الأعمال المدنية" },
  title: { en: "Civil Gallery", ar: "معرض الأعمال المدنية" },
  lede: {
    en: "On-site engineering photography from villa builds, substations, landscaping and infrastructure projects.",
    ar: "صور من المواقع لمشاريع الفلل والمحطات الفرعية وأعمال المناظر الطبيعية والبنية التحتية.",
  },
  items: [
    "civil_1.jpg","civil_2.jpg","civil_3.jpg","civil_4.jpg","civil_5.jpg",
    "civil_6.jpg","civil_7.jpg","civil_8.jpg","civil_9.jpg","civil_10.jpg",
    "civil_11.jpg","civil_13.jpg","civil_14.jpg","civil_15.jpg",
  ].map((f) => ({ imagePath: `/assets/${f}`, data: { alt: "Civil Work" } })),
});

seed({
  key: "chairman",
  overline: { en: "CHAIRMAN'S MESSAGE", ar: "كلمة رئيس مجلس الإدارة" },
  title: { en: "A word from our Chairman", ar: "كلمة من رئيس مجلس الإدارة" },
  extra: {
    imagePath: "/assets/chairman.png",
    name: { en: "Nasser Ali J Z Alali", ar: "ناصر على جديد زامل العلى" },
    role: { en: "Chairman",                ar: "رئيس مجلس الإدارة" },
    p1: {
      en: "Born from a modest manpower support operation, Nasser Al Ali Enterprises has grown into a trusted engineering and construction group through the commitment of our people and the demand for quality delivery in Qatar's fast-developing construction sector. We built our capacity block by block, and today we are a preferred delivery partner for major contractors and developers - measured by engineering discipline, safe execution and steadfast commitment to the work.",
      ar: "بدايات متواضعة كمزود خدمات دعم العمالة، ونمت ناصر العلي للمقاولات لتصل إلى مكانتها الحالية بفضل التزام فريقنا والطلب على الخدمات عالية الجودة في قطاع البناء المزدهر في قطر. لبنة تلو أخرى، رسّخنا مكانتنا كأحد أكثر مزودي الخدمات طلبًا من خلال احترافيتنا وتفانينا والتزامنا بالعمل.",
    },
    p2: {
      en: "We are clear that delivering what our clients need, when they need it, must never come at the cost of quality, safety or integrity. Our people are our real asset. We invest in skilled, motivated professionals with the right technical experience, because a company is only as good as the team that executes its work. Nasser Al Ali Enterprises exists to set the standard - through engineering rigour, on-site safety and evidence of quality in every project we deliver.",
      ar: "نعلم أن تقديم النتائج التي يحتاجها عملاؤنا، في الوقت الذي يحتاجونها فيه، لا يجب أن يعني أبدًا التضحية بالجودة. نضع الأولوية القصوى على موظفينا، لأننا نؤمن إيمانًا راسخًا بأن الشركة هي انعكاس لموظفيها - فريق من الأفراد المتحمسين ذوي المهارات العالية المختارين بالخبرة المناسبة. ناصر العلي للمقاولات ماضية في إحداث الفرق عبر تقديم النموذج.",
    },
    signoff: { en: "- Nasser Ali J Z Alali, Chairman", ar: "- ناصر على جديد زامل العلى، رئيس مجلس الإدارة" },
  },
});

seed({
  key: "certifications",
  overline: { en: "CREDENTIALS", ar: "اعتماداتنا" },
  title: { en: "Certifications", ar: "الشهادات" },
  lede: {
    en: "Nasser Al Ali Enterprises operates under three internationally recognised management-system standards, independently audited and certified by United Registrar of Systems (URS) - UKAS and IAF accredited. All three certificates are current through January 2029. Click any certificate to view it full size.",
    ar: "تعمل ناصر العلي للمقاولات وفق ثلاثة معايير دولية لأنظمة الإدارة، مُدقَّقة ومُعتمَدة بشكل مستقل من قِبل United Registrar of Systems (URS) - المعتمَدة من UKAS و IAF. جميع الشهادات الثلاث سارية حتى يناير 2029. انقر على أي شهادة لعرضها بالحجم الكامل.",
  },
  extra: {
    issuer:       { en: "Issued by URS (United Registrar of Systems) - UKAS + IAF accredited", ar: "صادرة عن URS (United Registrar of Systems) - معتمَدة من UKAS و IAF" },
    certNoLabel:  { en: "Certificate no.",  ar: "رقم الشهادة" },
    validLabel:   { en: "Valid until",      ar: "سارية حتى" },
    validUntil:   "09 Jan 2029",
  },
  items: [
    {
      imagePath: "/assets/certifications/iso-9001.webp?v=2",
      data: {
        id: "iso9001",
        code: "ISO 9001:2015",
        certNo: "109949/C/0001/UK/En",
        alt: "ISO 9001:2015 Quality Management System certificate for Nasser Al Ali Enterprises",
        title: { en: "Quality Management System", ar: "نظام إدارة الجودة" },
        desc: {
          en: "Certifies a quality-management system that consistently meets client, regulatory and statutory requirements across every project we deliver - from engineering design and procurement to construction supervision and handover.",
          ar: "تُثبت أن عملياتنا لإدارة الجودة تلبّي باستمرار متطلبات العملاء والمتطلبات القانونية والتنظيمية في كل مشروع نُنفذه.",
        },
      },
    },
    {
      imagePath: "/assets/certifications/iso-14001.webp?v=2",
      data: {
        id: "iso14001",
        code: "ISO 14001:2015",
        certNo: "109949/A/0001/UK/En",
        alt: "ISO 14001:2015 Environmental Management System certificate for Nasser Al Ali Enterprises",
        title: { en: "Environmental Management System", ar: "نظام الإدارة البيئية" },
        desc: {
          en: "Certifies an environmental-management system that identifies, monitors and reduces the environmental impact of our operations - site waste, emissions, energy and resource use across our plant, fleet and facilities.",
          ar: "تُثبت أننا نُحدّد ونُراقب ونُقلّل الأثر البيئي لعملياتنا - من نفايات المواقع والانبعاثات إلى استخدام الموارد عبر أسطولنا ومنشآتنا.",
        },
      },
    },
    {
      imagePath: "/assets/certifications/iso-45001.webp?v=2",
      data: {
        id: "iso45001",
        code: "ISO 45001:2018",
        certNo: "109949/B/0001/UK/En",
        alt: "ISO 45001:2018 Occupational Health and Safety Management System certificate for Nasser Al Ali Enterprises",
        title: { en: "Occupational Health & Safety Management System", ar: "نظام إدارة الصحة والسلامة المهنية" },
        desc: {
          en: "Certifies a health-and-safety management framework aligned to the world's leading H&S standard - hazard identification and risk control, incident reporting and continuous improvement in worker welfare. Replaces the earlier OHSAS 18001.",
          ar: "تُثبت تطبيقنا لإطار عمل السلامة المهنية وفق أعلى المعايير العالمية - يشمل التحكم بالمخاطر والإبلاغ عن الحوادث والتحسين المستمر لرفاهية العمال. تحل محل معيار OHSAS 18001 السابق.",
        },
      },
    },
  ],
});

seed({
  key: "awards",
  overline: { en: "RECOGNITION & CSR", ar: "التكريم والمسؤولية الاجتماعية" },
  title: { en: "Awards & Corporate Social Responsibility", ar: "التكريم والمسؤولية الاجتماعية للشركات" },
  lede: {
    en: "Nasser Al Ali Enterprises recognises the engineers, technicians and site teams whose dedication builds Qatar. The moments below show our Chairman presenting long-service, safety and outstanding-performance awards to team members across our sites and offices.",
    ar: "تحرص ناصر العلي للمقاولات على تكريم العمال والموظفين الذين يُساهمون في بناء قطر. تعرض الصور أدناه لحظات من تكريم رئيس مجلس الإدارة لأعضاء الفريق تقديرًا لخدمتهم الطويلة، وسِجل السلامة، والأداء المتميّز عبر مواقعنا ومكاتبنا.",
  },
  extra: {
    csrTitle:     { en: "Our commitment to people and community",                                                                                              ar: "التزامنا تجاه أفرادنا ومجتمعنا" },
    csrP1:        { en: "We recognise and reward the workers and engineers whose dedication and technical craft set the delivery standard on every project we build.",       ar: "نُكرّم ونُكافئ العمال المتميزين الذين يُجسّد تفانيهم ومهاراتهم المعيار الذي نلتزم به في كل مشروع." },
    csrP2:        { en: "Beyond recognition, we invest in workforce welfare, safe working conditions and continuous technical training - because construction quality is only as strong as the people who execute it.", ar: "بعيدًا عن التكريم، نستثمر في رفاهية الموظفين وبيئات العمل الآمنة والتدريب المستمر - لأن قوة الشركة من قوة أفرادها." },
    csrP3:        { en: "We are proud to support the communities where we operate across Qatar, backing local causes and creating stable, long-term opportunities for our workforce.",    ar: "نفخر بمساهمتنا في المجتمعات التي نعمل فيها عبر قطر، ودعم القضايا المحلية، وخلق فرص عمل مستقرة وطويلة الأمد لكوادرنا." },
    galleryTitle: { en: "Recognition Moments", ar: "لحظات التكريم" },
  },
  items: Array.from({ length: 40 }, (_, i) => {
    const n = String(i + 1).padStart(2, "0");
    return { imagePath: `/assets/awards/award-${n}.webp`, data: { alt: `Chairman presenting a recognition award to a team member (${i + 1})` } };
  }),
});

seed({
  key: "numbers",
  overline: { en: "BY THE NUMBERS", ar: "بالأرقام" },
  title: { en: "Two decades of measurable growth", ar: "عقدان من النمو الملموس" },
  lede: {
    en: "Engineering capability measured - where our people, projects and clients have taken us since 2005.",
    ar: "قصة أرقام تُروى منذ عام 2005 - موظفون، مشاريع، وعملاء.",
  },
  extra: {
    workforceKicker: { en: "Workforce · 2005 → 2026",                 ar: "القوى العاملة · 2005 → 2026" },
    workforceTitle:  { en: "From 50 to 5,000+ technical professionals in 20 years",           ar: "من 50 إلى أكثر من 5,000 في 20 عامًا" },
    workforceNote:   { en: "Approximate figures across the Group. Sources: HR records & annual reviews.", ar: "أرقام تقريبية على مستوى المجموعة. المصادر: سجلات الموارد البشرية والمراجعات السنوية." },
    mixKicker:       { en: "Workforce mix",                           ar: "تركيبة القوى العاملة" },
    mixTitle:        { en: "Skilled trades & engineering specialists",            ar: "حرفيون مهرة ومتخصصون" },
    donutLabel:      { en: "EMPLOYEES",                               ar: "موظف" },
    bars: [
      { year: "2005", target: 50,   px: 2,   labelText: "50" },
      { year: "2010", target: 500,  px: 20,  labelText: "500" },
      { year: "2015", target: 1500, px: 60,  labelText: "1.5K" },
      { year: "2020", target: 3000, px: 120, labelText: "3K" },
      { year: "2026", target: 5000, px: 200, labelText: "5K+" },
    ],
    donut: [
      { color: "#C9A24B", pct: 65, key: "labour", label: { en: "Skilled labour",                 ar: "العمالة الماهرة" } },
      { color: "#D9B76A", pct: 18, key: "mep",    label: { en: "MEP technicians",                ar: "فنيو الكهروميكانيك" } },
      { color: "#8AA0BF", pct: 10, key: "civil",  label: { en: "Civil engineers & supervisors", ar: "مهندسو ومشرفو الأعمال المدنية" } },
      { color: "#4A6486", pct:  7, key: "admin",  label: { en: "Admin & management",             ar: "الإدارة والدعم" } },
    ],
    kpis: [
      { value: 43, label: { en: "Major clients",   ar: "عميل رئيسي" },  detail: { en: "Al Habtoor, Hyundai, J&P, Samsung C&T, Elegancia, Gulf Contracting, Midmac-TAV, Dogus-Onur & more.", ar: "الحبتور، هيونداي، J&P، سامسونج C&T، إليغانسيا، جلف كونتراكتنج، ميدماك-تاف، دوغوس-أونور والمزيد." } },
      { value: 16, label: { en: "Group companies", ar: "شركات المجموعة" }, detail: { en: "A vertically integrated group ecosystem spanning construction, MEP, real estate and support services.", ar: "منظومة متكاملة رأسيًا تشمل البناء والكهروميكانيك والعقارات وخدمات الدعم." } },
      { value: 21, label: { en: "Years in Qatar",  ar: "سنة في قطر" }, detail: { en: "Established 2005 · Doha, State of Qatar · continuous operations.",                                    ar: "تأسست 2005 · الدوحة، دولة قطر · عمليات مستمرة." } },
    ],
  },
});

seed({
  key: "reviews",
  overline: { en: "OUR REPUTATION", ar: "سُمعتنا" },
  title: { en: "What our clients say", ar: "ما يقوله عملاؤنا" },
  lede: {
    en: "Verified reviews from clients and on-site delivery teams on Google.",
    ar: "مراجعات موثّقة من عملائنا وفرق العمل عبر خرائط جوجل.",
  },
  extra: {
    rating: 4.6,
    count: 35,
    gLabel:      { en: "Reviews on Google",             ar: "مراجعات على جوجل" },
    basedOn:     { en: "Based on",                      ar: "استنادًا إلى" },
    reviewsWord: { en: "reviews",                       ar: "مراجعة" },
    readAll:     { en: "Read all reviews on Google",    ar: "اقرأ جميع المراجعات على جوجل" },
  },
  items: [
    { data: { init: "T", color: "#4A6486", name: "Tariq Khan",     meta: "3 years ago",                       quote: "May Allah grant Nasser Al Ali a long life. I have never seen a well-wisher of a master and worker like him." } },
    { data: { init: "L", color: "#C9A24B", name: "Ledo Mohara",    meta: "Local Guide · 426 reviews · 7 years ago", quote: "Good manpower supply organization." } },
    { data: { init: "F", color: "#8AA0BF", name: "Farhan Hussain", meta: "2 reviews · 1 year ago",            quote: "I know this company is very good." } },
    { data: { init: "R", color: "#D9B76A", name: "Raju Khatri",    meta: "12 reviews · 5 years ago",          quote: "Good service." } },
    { data: { init: "S", color: "#4A6486", name: "Sitaram Gautam", meta: "1 review · 5 years ago",            quote: "Good, best company." } },
    { data: { init: "N", color: "#C9A24B", name: "Narayan Subedi", meta: "1 review · 7 years ago",            quote: "Good company." } },
  ],
});

console.log("Content seeded.");
