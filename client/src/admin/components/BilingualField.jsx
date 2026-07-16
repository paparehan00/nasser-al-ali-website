import { useRef } from "react";

// Bilingual input pair. `value` is an object `{en, ar}`; `onChange` receives
// the mutated object. Renders two inputs (or textareas) side-by-side.
export default function BilingualField({
  label,
  value,
  onChange,
  multiline = false,
  placeholderEn = "",
  placeholderAr = "",
  rows = 3,
}) {
  const v = value || { en: "", ar: "" };
  const setEn = (en) => onChange({ ...v, en });
  const setAr = (ar) => onChange({ ...v, ar });
  const idBase = useRef(`bf-${Math.random().toString(36).slice(2, 8)}`);

  const commonPropsEn = {
    id: `${idBase.current}-en`,
    value: v.en ?? "",
    onChange: (e) => setEn(e.target.value),
    placeholder: placeholderEn,
  };
  const commonPropsAr = {
    id: `${idBase.current}-ar`,
    value: v.ar ?? "",
    onChange: (e) => setAr(e.target.value),
    placeholder: placeholderAr,
    dir: "rtl",
    lang: "ar",
  };

  return (
    <div className="naa-admin-bilingual">
      <div className="naa-admin-bilingual-label">{label}</div>
      <div className="naa-admin-bilingual-row">
        <label className="naa-admin-bilingual-half">
          <span className="naa-admin-lang">EN</span>
          {multiline
            ? <textarea rows={rows} {...commonPropsEn} />
            : <input type="text" {...commonPropsEn} />}
        </label>
        <label className="naa-admin-bilingual-half">
          <span className="naa-admin-lang">AR</span>
          {multiline
            ? <textarea rows={rows} {...commonPropsAr} />
            : <input type="text" {...commonPropsAr} />}
        </label>
      </div>
    </div>
  );
}
