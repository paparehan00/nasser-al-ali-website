// Single-language (EN) input with a collapsed Arabic review panel.
// The AR value is filled by auto-translation on save.
// If the admin manually edits AR, they set the "manual" flag.
export default function TranslatableField({
  label,
  helper,
  value,          // {en: string, ar: string}
  onChange,       // (newValue: {en, ar}) => void
  multiline = false,
  rows = 3,
  arManual = false,
  onArManualChange, // (manual: boolean) => void
}) {
  const v = value || { en: "", ar: "" };

  const handleEnChange = (en) => onChange({ ...v, en });
  const handleArChange = (ar) => {
    onChange({ ...v, ar });
    onArManualChange?.(true);
  };
  const handleRetranslate = () => {
    onChange({ ...v, ar: "" });
    onArManualChange?.(false);
  };

  const InputEl = multiline ? "textarea" : "input";
  const inputProps = multiline
    ? { rows, value: v.en ?? "", onChange: (e) => handleEnChange(e.target.value), placeholder: "English…" }
    : { type: "text", value: v.en ?? "", onChange: (e) => handleEnChange(e.target.value), placeholder: "English…" };

  return (
    <div className="naa-tf">
      <div className="naa-tf-label">{label}</div>
      {helper && <div className="naa-tf-helper">{helper}</div>}
      <InputEl className="naa-tf-input" {...inputProps} />

      <details className="naa-tf-ar-details">
        <summary className="naa-tf-ar-summary">
          {arManual ? "Arabic (manually edited)" : "Arabic (auto) · review / edit"}
        </summary>
        <div className="naa-tf-ar-body">
          {arManual && (
            <div className="naa-tf-ar-manual-row">
              <span className="naa-tf-ar-badge">Manually edited — won't be auto-overwritten</span>
              <button type="button" className="naa-tf-ar-retranslate" onClick={handleRetranslate}>
                ↻ Re-translate from EN
              </button>
            </div>
          )}
          <textarea
            className="naa-tf-ar-input"
            dir="rtl"
            lang="ar"
            rows={multiline ? rows : 2}
            value={v.ar ?? ""}
            onChange={(e) => handleArChange(e.target.value)}
            placeholder={v.ar ? "" : "Arabic will appear here after saving…"}
          />
        </div>
      </details>
    </div>
  );
}
