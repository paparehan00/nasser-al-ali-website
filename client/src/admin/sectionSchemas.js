// Field types:
//   bilingual          → {en,ar} single-line inputs
//   bilingual-textarea → {en,ar} multi-line textareas
//   text               → plain string input
//   textarea           → plain string textarea
//   number             → numeric input
//   boolean            → checkbox
//   color              → color picker
//   image              → ImageUpload (needs sectionKey)
//   repeater           → array of sub-objects with their own subFields

export const SECTION_SCHEMAS = {
  hero: {
    label: "Hero",
    singleton: true,
    hasImage: false,
    extraFields: [
      { key: "btnProposal",  type: "bilingual", label: "Primary button text",   helper: 'e.g. "Request a Proposal"' },
      { key: "btnProjects",  type: "bilingual", label: "Secondary button text",  helper: 'e.g. "View Projects"' },
      { key: "scroll",       type: "bilingual", label: "Scroll hint text",       helper: "Small text below the scroll arrow" },
      { key: "video.webm",   type: "text",      label: "Video — WebM path",      helper: "/assets/hero-1080.webm", advanced: true },
      { key: "video.mp4",    type: "text",      label: "Video — MP4 path",       helper: "/assets/hero-1080.mp4", advanced: true },
      { key: "video.poster", type: "text",      label: "Video — poster image",   helper: "/assets/hero-poster.jpg", advanced: true },
    ],
    itemFields: [],
  },

  stats: {
    label: "Stats bar",
    singleton: false,
    hasImage: false,
    extraFields: [],
    itemFields: [
      { key: "target", type: "number",  label: "Count-up target",  helper: "The number to count up to (e.g. 5000)" },
      { key: "plus",   type: "boolean", label: 'Show "+" suffix' },
      { key: "label",  type: "bilingual", label: "Stat label",     helper: 'e.g. "Workforce" / "القوى العاملة"' },
    ],
  },

  chairman: {
    label: "Chairman",
    singleton: true,
    hasImage: false,
    extraFields: [
      { key: "name",      type: "bilingual",          label: "Chairman's full name" },
      { key: "role",      type: "bilingual",          label: "Title / role",             helper: 'e.g. "Chairman & CEO"' },
      { key: "imagePath", type: "text",               label: "Portrait photo path",      helper: "/assets/chairman.png or an uploaded path" },
      { key: "p1",        type: "bilingual-textarea", label: "Quote — paragraph 1" },
      { key: "p2",        type: "bilingual-textarea", label: "Quote — paragraph 2" },
      { key: "signoff",   type: "bilingual",          label: "Quote sign-off",           helper: 'e.g. "— Nasser Al Ali, Chairman"' },
    ],
    itemFields: [],
  },

  services: {
    label: "Services",
    singleton: false,
    hasImage: true,
    extraFields: [],
    itemFields: [
      { key: "id",    type: "text", label: "Service icon ID", helper: "One of: manpower · equipment · civil · mep · cleaning · business" },
      { key: "title", type: "bilingual", label: "Service title" },
      { key: "body",  type: "bilingual-textarea", label: "Description paragraph" },
      { key: "alt",   type: "text", label: "Image alt text",  helper: "Describes the photo for screen readers" },
    ],
  },

  numbers: {
    label: "By the numbers",
    singleton: true,
    hasImage: false,
    extraFields: [
      { key: "workforceKicker", type: "bilingual", label: "Bar chart — kicker",    helper: "Small label above the chart title" },
      { key: "workforceTitle",  type: "bilingual", label: "Bar chart — title" },
      { key: "workforceNote",   type: "bilingual", label: "Bar chart — note",      helper: "Caption below the chart" },
      {
        key: "bars",
        type: "repeater",
        label: "Bars (workforce by year)",
        addLabel: "Add year",
        defaultRow: { year: "", labelText: "", px: 100 },
        subFields: [
          { key: "year",      type: "text",   label: "Year" },
          { key: "labelText", type: "text",   label: "Bar label",  helper: "e.g. 4,000+" },
          { key: "px",        type: "number", label: "Bar height", helper: "SVG pixels (0–230)" },
        ],
      },
      { key: "mixKicker",   type: "bilingual", label: "Donut chart — kicker" },
      { key: "mixTitle",    type: "bilingual", label: "Donut chart — title" },
      { key: "donutLabel",  type: "bilingual", label: "Donut centre label", helper: 'Text under the "5K+" in the centre' },
      {
        key: "donut",
        type: "repeater",
        label: "Donut segments",
        addLabel: "Add segment",
        defaultRow: { key: "", pct: 0, color: "#C9A24B", label: { en: "", ar: "" } },
        subFields: [
          { key: "key",   type: "text",      label: "Slug / key" },
          { key: "pct",   type: "number",    label: "Percentage (%)" },
          { key: "color", type: "color",     label: "Segment colour" },
          { key: "label", type: "bilingual", label: "Legend label" },
        ],
      },
      {
        key: "kpis",
        type: "repeater",
        label: "KPI cards",
        addLabel: "Add KPI",
        defaultRow: { value: "", label: { en: "", ar: "" }, detail: { en: "", ar: "" } },
        subFields: [
          { key: "value",  type: "text",      label: "Value",  helper: 'e.g. "350+"' },
          { key: "label",  type: "bilingual", label: "KPI label" },
          { key: "detail", type: "bilingual", label: "Detail line" },
        ],
      },
    ],
    itemFields: [],
  },

  clients: {
    label: "Trusted partners",
    singleton: false,
    hasImage: true,
    extraFields: [],
    itemFields: [
      { key: "name", type: "text", label: "Partner / client name", helper: "Used as the image alt text" },
    ],
  },

  projects: {
    label: "Featured projects",
    singleton: false,
    hasImage: true,
    extraFields: [],
    itemFields: [
      { key: "name",     type: "text",    label: "Project name" },
      { key: "location", type: "text",    label: "Location",                helper: 'e.g. "Lusail City, Qatar"' },
      { key: "featured", type: "boolean", label: "Feature card (double width in the masonry grid)" },
    ],
  },

  gallery: {
    label: "Civil gallery",
    singleton: false,
    hasImage: true,
    extraFields: [],
    itemFields: [
      { key: "alt", type: "text", label: "Image description (alt text)", helper: "Describes the photo for screen readers" },
    ],
  },

  certifications: {
    label: "Certifications",
    singleton: false,
    hasImage: true,
    extraFields: [
      { key: "certNoLabel", type: "bilingual", label: '"Cert No." label',   helper: 'e.g. "Certificate No." / "رقم الشهادة"' },
      { key: "validLabel",  type: "bilingual", label: '"Valid until" label', helper: 'e.g. "Valid until"' },
      { key: "validUntil",  type: "text",      label: "Global validity date", helper: 'e.g. "2026-12-31"' },
      { key: "issuer",      type: "bilingual", label: "Issuing body",         helper: 'e.g. "Bureau Veritas"' },
    ],
    itemFields: [
      { key: "code",       type: "text",               label: "Certificate code",    helper: "e.g. ISO 9001:2015" },
      { key: "title",      type: "bilingual",           label: "Certificate title" },
      { key: "desc",       type: "bilingual-textarea",  label: "Short description" },
      { key: "certNo",     type: "text",               label: "Certificate number" },
      { key: "validUntil", type: "text",               label: "Valid until",         helper: 'e.g. "09 Jan 2029"' },
      { key: "issuer",     type: "bilingual",           label: "Issued by",           helper: 'e.g. "Bureau Veritas - UKAS accredited"' },
      { key: "alt",        type: "text",               label: "Image alt text" },
    ],
  },

  awards: {
    label: "Awards & CSR",
    singleton: false,
    hasImage: true,
    extraFields: [
      { key: "csrTitle",    type: "bilingual",          label: "CSR block — title" },
      { key: "csrP1",       type: "bilingual-textarea", label: "CSR pillar 1" },
      { key: "csrP2",       type: "bilingual-textarea", label: "CSR pillar 2" },
      { key: "csrP3",       type: "bilingual-textarea", label: "CSR pillar 3" },
      { key: "galleryTitle",type: "bilingual",          label: "Gallery sub-heading", helper: "Appears above the award photo grid" },
    ],
    itemFields: [
      { key: "alt", type: "text", label: "Image description (alt text)" },
    ],
  },

  reviews: {
    label: "Reviews",
    singleton: false,
    hasImage: false,
    extraFields: [
      { key: "rating",      type: "number",  label: "Google rating",         helper: "e.g. 4.6" },
      { key: "count",       type: "number",  label: "Number of reviews" },
      { key: "gLabel",      type: "bilingual", label: '"Google Reviews" label' },
      { key: "basedOn",     type: "bilingual", label: '"Based on" text',     helper: 'e.g. "Based on"' },
      { key: "reviewsWord", type: "bilingual", label: '"Reviews" word',      helper: 'e.g. "reviews" / "تقييم"' },
      { key: "readAll",     type: "bilingual", label: "Read-all link text",  helper: 'e.g. "Read all reviews on Google"' },
    ],
    itemFields: [
      { key: "name",  type: "text",     label: "Reviewer name" },
      { key: "meta",  type: "text",     label: "Review metadata",      helper: 'e.g. "1 year ago · Local Guide"' },
      { key: "init",  type: "text",     label: "Avatar initial(s)",    helper: "1–2 letters shown in the coloured circle" },
      { key: "color", type: "color",    label: "Avatar background colour" },
      { key: "quote", type: "textarea", label: "Review text" },
    ],
  },
};

export function getSchema(key) {
  return SECTION_SCHEMAS[key] ?? {
    label: key,
    singleton: false,
    hasImage: false,
    extraFields: [],
    itemFields: [],
  };
}

export function getItemDisplayName(item) {
  const d = item?.data || {};
  if (typeof d.name === "string" && d.name) return d.name;
  if (d.title?.en) return d.title.en;
  if (d.label?.en) return d.label.en;
  if (d.code) return d.code + (d.title?.en ? " — " + d.title.en : "");
  if (typeof d.target === "number") return String(d.target) + (d.plus ? "+" : "");
  if (d.alt) return d.alt;
  if (d.value) return d.value;
  return `#${item.id}`;
}
