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
      en: "Skilled, reliable workforce for construction, maintenance, and industrial operations across Qatar.",
      ar: "عمالة ماهرة وموثوقة لأعمال البناء والصيانة والعمليات الصناعية في قطر.",
    },
    description: {
      en: "Nasser Al Ali Enterprises supplies trained manpower for projects of every size across Qatar. We started as a manpower company back in 2005, and it is still one of the things we do best. Whether a client needs a few workers for a short task or a large team for a long-term contract, we handle the hiring, training, and daily management so our clients can focus on the job itself.",
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
      en: "Two decades of manpower experience in Qatar means we understand local labour law, visa and accommodation requirements, and how to keep a large workforce organized and safe on site. Our workers are trained before they reach site and supervised throughout the job, so clients get consistent quality, not just extra hands.",
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
      en: "A modern heavy-equipment fleet with operators for excavation, lifting, and site logistics.",
      ar: "أسطول حديث من المعدات الثقيلة مع مشغّلين للحفر والرفع واللوجستيات الميدانية.",
    },
    description: {
      en: "We run a modern fleet of heavy machinery, ready to support excavation, lifting, and material handling on any site in Qatar. Every machine comes with a trained operator, so clients get the equipment and the skill to run it safely and efficiently, not just a rented vehicle.",
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
      en: "Our fleet is maintained regularly, so breakdowns and downtime stay rare. We plan equipment schedules around each project's real timeline, which means machines and operators show up when they are actually needed, not late and not sitting idle.",
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
      en: "Turnkey civil construction: substations, villas, landscaping, and infrastructure.",
      ar: "أعمال مدنية شاملة بمفتاح اليد: محطات فرعية، فلل، مناظر طبيعية، وبنية تحتية.",
    },
    description: {
      en: "Our civil contracting team delivers full construction projects from start to finish. \"Turnkey\" means we handle the whole job, design coordination, materials, labour, equipment, and site management, so the client gets a finished result, not just a piece of the work.",
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
      en: "Because we also run our own manpower and equipment divisions, our civil projects do not depend on outside subcontractors for the basics. That means fewer delays, clearer accountability, and one company responsible for the result, from the first excavation to the final handover.",
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
      en: "Integrated mechanical, electrical, and plumbing works for buildings and industrial facilities.",
      ar: "أعمال ميكانيكية وكهربائية وسباكة متكاملة للمباني والمنشآت الصناعية.",
    },
    description: {
      en: "MEP stands for Mechanical, Electrical, and Plumbing, the systems that make a building actually work: power, water, air conditioning, and drainage. We design, install, and maintain these systems for both new buildings and industrial facilities across Qatar.",
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
      en: "MEP problems are expensive to fix after a building is finished, so we focus on getting the installation right the first time. Our technicians work closely with the civil team from early in the project, which avoids the clashes and rework that happen when MEP is treated as an afterthought.",
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
      en: "Comprehensive commercial and post-construction cleaning services.",
      ar: "خدمات تنظيف شاملة تجارية ومرحلة ما بعد البناء.",
    },
    description: {
      en: "We provide cleaning services for offices, commercial buildings, and construction sites once the heavy work is done. Post-construction cleaning is a specific skill: it means removing dust, debris, and residue safely so a new building is ready to actually use, not just swept.",
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
      en: "Because we also build the buildings, we understand exactly what post-construction cleaning needs to cover: dust in ducts, residue on new fittings, debris in corners contractors miss. Our teams know what a finished handover should look like, because we have handed over the buildings ourselves.",
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
      en: "Managed office space and real-estate solutions through our Nasser Al Ali Business Center and group real-estate arm.",
      ar: "خدمات مساحات مكتبية مُدارة وحلول عقارية من خلال مركز أعمال ناصر العلي وذراع العقارات في المجموعة.",
    },
    description: {
      en: "Beyond construction, we also help businesses get set up and operating in Qatar through managed office space and real-estate support, run through our Nasser Al Ali Business Center and our group's real-estate arm.",
      ar: "بعيدًا عن أعمال المقاولات، نساعد أيضًا الشركات على التأسيس والعمل في قطر من خلال مساحات مكتبية مُدارة ودعم عقاري، عبر مركز أعمال ناصر العلي وذراع العقارات التابعة لمجموعتنا.",
    },
    scopeItems: [
      { en: "Managed and serviced office space for rent", ar: "مساحات مكتبية مُدارة ومخدومة للإيجار" },
      { en: "Support for business setup and a local address in Qatar", ar: "دعم لتأسيس الأعمال والحصول على عنوان محلي في قطر" },
      { en: "Real-estate solutions through our group's property arm", ar: "حلول عقارية من خلال الذراع العقارية لمجموعتنا" },
      { en: "Flexible terms for small businesses and larger companies alike", ar: "شروط مرنة تناسب الشركات الصغيرة والكبرى على حد سواء" },
    ],
    why: {
      en: "We understand what it takes to operate in Qatar because we have built our own business here since 2005. That experience means we can offer straightforward, practical office and property solutions, not just square footage.",
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
