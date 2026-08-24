// Detailed content for each Core Services sub-page (/services/:slug).
// `id` matches the service item's data.id in the CMS "services" section —
// used to look up that item's own image/title for the page hero, so the
// sub-page reuses real content instead of needing new assets.
// Content expands honestly on the short card copy already shown on the
// Services page — no invented certifications or claims.

export const SERVICE_DETAILS = {
  "manpower-support": {
    id: "manpower",
    photo: "/assets/services-manpower-support-2.jpg",
    tagline: {
      en: "Certified technical manpower for construction, maintenance and industrial operations across Qatar.",
      ar: "عمالة ماهرة وموثوقة لأعمال البناء والصيانة والعمليات الصناعية في قطر.",
    },
    description: {
      en: "Nasser Al Ali Enterprises supplies certified technical manpower for projects of every scale across Qatar. Since 2005 we have supplied general labour, skilled trades, plant operators and site supervisors to contractors and developers nationwide. We manage the full workforce lifecycle - sourcing, permits and visas, accommodation, training and daily site supervision - so clients receive a compliant, productive team and can focus on delivery.",
      ar: "توفر ناصر العلي للمقاولات عمالة مدرَّبة لمشاريع بكل الأحجام في قطر. بدأنا كشركة توفير عمالة عام 2005، ولا يزال هذا من أقوى مجالاتنا حتى اليوم. سواء احتاج العميل إلى عدد قليل من العمال لمهمة قصيرة أو فريق كبير لعقد طويل الأمد، نتولى نحن التوظيف والتدريب والإدارة اليومية، ليتفرغ عملاؤنا للعمل نفسه.",
    },
    scopeItems: [
      { en: "General labourers", ar: "عمّال عموميون" },
      { en: "Skilled tradesmen: electricians, plumbers, welders, carpenters, masons", ar: "حرفيون مهرة: كهربائيون، سبّاكون، لحّامون، نجّارون، بنّاؤون" },
      { en: "Heavy equipment operators", ar: "مشغّلو معدات ثقيلة" },
      { en: "Site supervisors and foremen", ar: "مشرفون ورؤساء عمل في الموقع" },
      { en: "Cleaners and support staff", ar: "عمال تنظيف ودعم" },
      { en: "Short-term and long-term manpower contracts", ar: "عقود عمالة قصيرة وطويلة الأمد" },
      { en: "Flexible team sizes that scale up or down as the project changes", ar: "فرق عمل مرنة يمكن زيادتها أو تقليصها حسب تطور المشروع" },
    ],
    why: {
      en: "Two decades of manpower delivery in Qatar means we work to local labour law, visa and accommodation rules, and to our own site safety and quality controls. Every worker is inducted, briefed and supervised on site, and our supervisors hold the daily method-statement and risk-assessment review. Clients get consistent, compliant output - not just extra hands.",
      ar: "خبرة تمتد لعقدين في سوق العمالة بقطر تعني أننا نفهم قوانين العمل المحلية، ومتطلبات التأشيرات والسكن، وكيفية تنظيم فريق عمل كبير بأمان في الموقع. يخضع عمالنا للتدريب قبل الوصول إلى الموقع ويُشرف عليهم طوال فترة العمل، ليحصل العميل على جودة ثابتة، لا مجرد أيدٍ إضافية.",
    },
    ctaText: {
      en: "Need reliable manpower for your project?",
      ar: "هل تحتاج إلى عمالة موثوقة لمشروعك؟",
    },
  },

  "equipment-support": {
    id: "equipment",
    photo: "/assets/services-equipment-support-2.jpg",
    // Interactive 3D preview shown only on this service page. Model: "Building
    // construction crane" by Kieran Farr, via Poly Pizza (poly.pizza/m/cm5teXZ5Ctr),
    // licensed CC BY 3.0 — attribution kept here and rendered in the section.
    model3D: {
      src: "/assets/equipment-crane.glb",
      alt: "Rotatable 3D model of a tower crane",
      cameraOrbit: "-35deg 78deg 105%",
      credit: { name: "Kieran Farr", url: "https://poly.pizza/m/cm5teXZ5Ctr" },
    },
    tagline: {
      en: "Modern heavy plant and equipment with trained operators for excavation, lifting and site logistics.",
      ar: "أسطول حديث من المعدات الثقيلة مع مشغّلين للحفر والرفع واللوجستيات الميدانية.",
    },
    description: {
      en: "We operate a modern fleet of heavy plant and equipment, ready for excavation, earthworks, lifting and material handling on sites across Qatar. Every machine is supplied with a trained operator and a safe lifting or working plan, so clients receive the equipment and the technical skill to run it efficiently and in line with site HSE requirements - not just a rented machine.",
      ar: "نُشغّل أسطولاً حديثًا من المعدات الثقيلة، جاهزًا لدعم أعمال الحفر والرفع ونقل المواد في أي موقع بقطر. تأتي كل آلة مع مشغّل مدرَّب، ليحصل العميل على المعدة والمهارة اللازمة لتشغيلها بأمان وكفاءة، لا مجرد مركبة مستأجرة.",
    },
    scopeItems: [
      { en: "Excavators, loaders, and bulldozers for earthworks", ar: "حفّارات وشاحنات تحميل وجرّافات لأعمال الحفر" },
      { en: "Cranes and lifting equipment for heavy loads", ar: "رافعات ومعدات رفع للأحمال الثقيلة" },
      { en: "Dump trucks and trailers for site logistics and material transport", ar: "شاحنات نقل ومقطورات للوجستيات الموقع ونقل المواد" },
      { en: "Generators and support machinery for site power needs", ar: "مولّدات ومعدات دعم لاحتياجات الطاقة في الموقع" },
      { en: "Flexible rental terms, from single-day hire to long-term project contracts", ar: "شروط تأجير مرنة، من التأجير ليوم واحد إلى عقود المشاريع طويلة الأمد" },
      { en: "Trained, experienced operators included with every machine", ar: "مشغّلون مدرَّبون وذوو خبرة مع كل آلة" },
    ],
    why: {
      en: "Our fleet is maintained to a planned preventive-maintenance schedule, which keeps breakdowns and downtime rare. We plan equipment allocation around each project's programme, so plant, operators and site logistics arrive exactly when the schedule needs them - on time, mobilised and never idle.",
      ar: "تتم صيانة أسطولنا بانتظام، لذا تبقى الأعطال وتوقف العمل نادرة. نخطط لجداول المعدات وفق الجدول الزمني الحقيقي لكل مشروع، ما يعني وصول الآلات والمشغّلين عند الحاجة الفعلية، لا متأخرين ولا معطَّلين بلا عمل.",
    },
    ctaText: {
      en: "Need equipment and operators on site?",
      ar: "هل تحتاج إلى معدات ومشغّلين في موقعك؟",
    },
  },

  "civil-contracting": {
    id: "civil",
    photo: "/assets/services-civil-contracting-2.jpg",
    tagline: {
      en: "Turnkey civil construction - substations, villas, roads, utilities and landscaping.",
      ar: "أعمال مدنية شاملة بمفتاح اليد: محطات فرعية، فلل، مناظر طبيعية، وبنية تحتية.",
    },
    description: {
      en: "Our civil contracting division delivers construction and infrastructure projects end to end. Turnkey delivery means we take responsibility for the complete scope - design coordination, procurement, materials, labour, plant and site management - so clients receive a finished, commissioning-ready asset under a single contract, rather than a package of separate work packages.",
      ar: "يُنجز فريق المقاولات المدنية لدينا مشاريع إنشائية كاملة من البداية إلى النهاية. مفهوم \"مفتاح اليد\" يعني أننا نتولى العمل بأكمله، تنسيق التصميم، المواد، العمالة، المعدات، وإدارة الموقع، ليحصل العميل على نتيجة جاهزة، لا جزءًا من العمل فقط.",
    },
    scopeItems: [
      { en: "Electrical substations and utility structures", ar: "محطات كهرباء فرعية ومنشآت مرافق" },
      { en: "Villas and residential buildings", ar: "فلل ومبانٍ سكنية" },
      { en: "Landscaping and outdoor works", ar: "أعمال مناظر طبيعية وخارجية" },
      { en: "Roads, infrastructure, and site development", ar: "طرق وبنية تحتية وتطوير مواقع" },
      { en: "Project management from groundbreaking to handover", ar: "إدارة المشروع من بدء الحفر حتى التسليم" },
      { en: "Coordination between our manpower, equipment, and MEP teams under one contract", ar: "تنسيق بين فرق العمالة والمعدات والأعمال الكهروميكانيكية لدينا ضمن عقد واحد" },
    ],
    why: {
      en: "Because we also self-perform manpower, plant and MEP, our civil projects do not depend on third-party subcontractors for the critical path. This means fewer interface delays, single-point accountability and one company answerable for quality, programme and HSE - from first excavation and groundworks to structural completion and final handover.",
      ar: "لأننا نُشغّل أيضًا أقسامنا الخاصة للعمالة والمعدات، لا تعتمد مشاريعنا المدنية على مقاولين من الباطن للأساسيات. هذا يعني تأخيرًا أقل، ومسؤولية أوضح، وشركة واحدة مسؤولة عن النتيجة، من أول حفرية حتى التسليم النهائي.",
    },
    ctaText: {
      en: "Planning a civil construction project?",
      ar: "هل تخطط لمشروع إنشائي مدني؟",
    },
  },

  "mep-contracting": {
    id: "mep",
    photo: "/assets/services-mep-contracting-2.jpg",
    tagline: {
      en: "Design, installation and maintenance of integrated MEP systems for buildings and industry.",
      ar: "أعمال ميكانيكية وكهربائية وسباكة متكاملة للمباني والمنشآت الصناعية.",
    },
    description: {
      en: "MEP - mechanical, electrical and plumbing - provides the active systems that make a building work: HVAC, power distribution, water supply, drainage and fire protection. We design, install, test, commission and maintain these systems for new buildings, fit-outs and industrial facilities across Qatar, delivered in coordination with the civil works to keep the programme on track.",
      ar: "الأعمال الكهروميكانيكية (MEP) تعني الأنظمة الميكانيكية والكهربائية والسباكة، وهي الأنظمة التي تجعل المبنى يعمل فعليًا: الطاقة، والمياه، وتكييف الهواء، والصرف. نصمم هذه الأنظمة ونركّبها ونصونها للمباني الجديدة والمنشآت الصناعية في قطر.",
    },
    scopeItems: [
      { en: "Electrical installation and wiring for buildings and facilities", ar: "تمديدات وتركيبات كهربائية للمباني والمنشآت" },
      { en: "HVAC (heating, ventilation, and air conditioning) systems", ar: "أنظمة التدفئة والتهوية وتكييف الهواء" },
      { en: "Plumbing and drainage systems", ar: "أنظمة السباكة والصرف الصحي" },
      { en: "Fire safety and detection system installation", ar: "تركيب أنظمة السلامة من الحرائق والكشف عنها" },
      { en: "Maintenance and support after installation", ar: "الصيانة والدعم بعد التركيب" },
      { en: "MEP work coordinated with our civil contracting team when a project needs both", ar: "تنسيق الأعمال الكهروميكانيكية مع فريق المقاولات المدنية عند الحاجة لكليهما" },
    ],
    why: {
      en: "MEP defects are very expensive to remediate after handover, so we engineer the installation right first time. Our MEP engineers coordinate with the civil team from pre-construction, producing coordinated services drawings and a testing-and-commissioning plan that resolve clashes early - reducing rework, delays and costly post-completion changes.",
      ar: "مشاكل الأعمال الكهروميكانيكية مكلفة الإصلاح بعد اكتمال المبنى، لذا نركّز على إنجاز التركيب بشكل صحيح من المرة الأولى. يعمل فنيونا بتنسيق وثيق مع فريق الأعمال المدنية منذ بداية المشروع، ما يتفادى التعارضات وإعادة العمل التي تحدث عندما تُعامَل الأعمال الكهروميكانيكية كفكرة لاحقة.",
    },
    ctaText: {
      en: "Need MEP work for your building or facility?",
      ar: "هل تحتاج إلى أعمال كهروميكانيكية لمبناك أو منشأتك؟",
    },
  },

  "professional-cleaning": {
    id: "cleaning",
    photo: "/assets/services-professional-cleaning-2.jpg",
    tagline: {
      en: "Commercial and post-construction cleaning to a client-ready specification.",
      ar: "خدمات تنظيف شاملة تجارية ومرحلة ما بعد البناء.",
    },
    description: {
      en: "We provide commercial and post-construction cleaning for offices, commercial buildings and completed construction sites. Post-construction cleaning is a specialist discipline: removing construction dust, debris, residue and protection from surfaces and services, then detailing to a defined standard, so a new asset is genuinely ready for use and handover - not merely swept.",
      ar: "نقدّم خدمات تنظيف للمكاتب والمباني التجارية ومواقع البناء بعد انتهاء الأعمال الثقيلة. التنظيف بعد البناء مهارة خاصة: يعني إزالة الغبار والمخلفات والبقايا بأمان، ليكون المبنى الجديد جاهزًا للاستخدام فعليًا، لا مجرد مبنى تم كنسه.",
    },
    scopeItems: [
      { en: "Daily or scheduled commercial office and facility cleaning", ar: "تنظيف مكاتب ومنشآت تجارية يومي أو مجدوَل" },
      { en: "Deep post-construction cleaning before handover", ar: "تنظيف عميق بعد البناء قبل التسليم" },
      { en: "Window, floor, and surface cleaning for large sites", ar: "تنظيف النوافذ والأرضيات والأسطح للمواقع الكبيرة" },
      { en: "Waste removal and site tidying", ar: "إزالة النفايات وترتيب الموقع" },
      { en: "Flexible contracts: one-time jobs or ongoing service", ar: "عقود مرنة: مهمة لمرة واحدة أو خدمة مستمرة" },
    ],
    why: {
      en: "Because we also build and fit out buildings, we know exactly what a post-construction clean must cover - dust in ductwork and risers, residue on new fixtures, adhesive and protection debris in the corners others miss. Our teams clean to the handover specification we ourselves would expect, because we hand over buildings.",
      ar: "لأننا نبني المباني أيضًا، نفهم بالضبط ما يجب أن يشمله التنظيف بعد البناء، الغبار داخل المجاري الهوائية، البقايا على التركيبات الجديدة، المخلفات في الزوايا التي يغفل عنها المقاولون غالبًا. تعرف فرقنا كيف يجب أن يبدو التسليم النهائي، لأننا سلّمنا المباني بأنفسنا.",
    },
    ctaText: {
      en: "Need commercial or post-construction cleaning?",
      ar: "هل تحتاج إلى تنظيف تجاري أو ما بعد البناء؟",
    },
  },

  "business-center-real-estate": {
    id: "business",
    tagline: {
      en: "Managed office space and real-estate solutions through Nasser Al Ali Business Center.",
      ar: "خدمات مساحات مكتبية مُدارة وحلول عقارية من خلال مركز أعمال ناصر العلي وذراع العقارات في المجموعة.",
    },
    description: {
      en: "Beyond construction, we support businesses to set up and operate in Qatar through managed, serviced office space and real-estate services, delivered by our Nasser Al Ali Business Center and the group's property arm. We provide a ready-to-operate local base, supporting documentation and practical property options for companies entering or expanding in the Qatari market.",
      ar: "بعيدًا عن أعمال المقاولات، نساعد أيضًا الشركات على التأسيس والعمل في قطر من خلال مساحات مكتبية مُدارة ودعم عقاري، عبر مركز أعمال ناصر العلي وذراع العقارات التابعة لمجموعتنا.",
    },
    scopeItems: [
      { en: "Managed and serviced office space for rent", ar: "مساحات مكتبية مُدارة ومخدومة للإيجار" },
      { en: "Support for business setup and a local address in Qatar", ar: "دعم لتأسيس الأعمال والحصول على عنوان محلي في قطر" },
      { en: "Real-estate solutions through our group's property arm", ar: "حلول عقارية من خلال الذراع العقارية لمجموعتنا" },
      { en: "Flexible terms for small businesses and larger companies alike", ar: "شروط مرنة تناسب الشركات الصغيرة والكبرى على حد سواء" },
    ],
    why: {
      en: "We have operated our own business in Qatar since 2005, so we understand the regulatory, licensing and property landscape first-hand. That experience lets us offer practical, compliant office and property solutions - not just square footage - so companies can establish and operate with confidence.",
      ar: "نفهم متطلبات العمل في قطر لأننا بنينا أعمالنا الخاصة هنا منذ عام 2005. هذه الخبرة تمكّننا من تقديم حلول مكتبية وعقارية عملية ومباشرة، لا مجرد مساحة مربعة فارغة.",
    },
    ctaText: {
      en: "Looking for office space or real-estate support?",
      ar: "هل تبحث عن مساحة مكتبية أو دعم عقاري؟",
    },
  },
};

export const SERVICE_SLUGS_BY_ID = Object.fromEntries(
  Object.entries(SERVICE_DETAILS).map(([slug, v]) => [v.id, slug])
);
