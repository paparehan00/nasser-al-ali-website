import { useState } from "react";
import TranslatableField from "./TranslatableField.jsx";
import ImageUpload from "./ImageUpload.jsx";

function deepGet(obj, key) {
  return key.split(".").reduce((o, k) => (o != null ? o[k] : undefined), obj ?? {});
}

function deepSet(obj, key, value) {
  const keys = key.split(".");
  const result = { ...(obj ?? {}) };
  let cur = result;
  for (let i = 0; i < keys.length - 1; i++) {
    cur[keys[i]] = { ...(cur[keys[i]] ?? {}) };
    cur = cur[keys[i]];
  }
  cur[keys[keys.length - 1]] = value;
  return result;
}

export default function StructuredEditor({
  fields,
  value,
  onChange,
  sectionKey,
  arManualKeys,    // Set<string> — paths where admin manually edited Arabic
  onArManualChange, // (fullPath: string, manual: boolean) => void
  fieldPrefix = "", // path prefix for nested contexts (e.g. "extra" or "extra.donut.0")
}) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const normalFields   = fields.filter((f) => !f.advanced);
  const advancedFields = fields.filter((f) => f.advanced);

  const handleChange = (key, v) => onChange(deepSet(value, key, v));

  const fullPath = (key) => fieldPrefix ? `${fieldPrefix}.${key}` : key;

  return (
    <div className="naa-se">
      {normalFields.map((field) => (
        <FieldRenderer
          key={field.key}
          field={field}
          value={deepGet(value, field.key)}
          onChange={(v) => handleChange(field.key, v)}
          sectionKey={sectionKey}
          arManual={arManualKeys?.has(fullPath(field.key)) ?? false}
          onArManualChange={(manual) => onArManualChange?.(fullPath(field.key), manual)}
          arManualKeys={arManualKeys}
          onArManualChange_full={onArManualChange}
          fieldPrefix={fullPath(field.key)}
        />
      ))}

      {advancedFields.length > 0 && (
        <details className="naa-se-advanced" open={showAdvanced} onToggle={(e) => setShowAdvanced(e.target.open)}>
          <summary className="naa-se-advanced-toggle">Advanced settings</summary>
          <div className="naa-se-advanced-body">
            {advancedFields.map((field) => (
              <FieldRenderer
                key={field.key}
                field={field}
                value={deepGet(value, field.key)}
                onChange={(v) => handleChange(field.key, v)}
                sectionKey={sectionKey}
                arManual={arManualKeys?.has(fullPath(field.key)) ?? false}
                onArManualChange={(manual) => onArManualChange?.(fullPath(field.key), manual)}
                arManualKeys={arManualKeys}
                onArManualChange_full={onArManualChange}
                fieldPrefix={fullPath(field.key)}
              />
            ))}
          </div>
        </details>
      )}
    </div>
  );
}

function FieldRenderer({
  field, value, onChange, sectionKey,
  arManual, onArManualChange,
  arManualKeys, onArManualChange_full, fieldPrefix,
}) {
  switch (field.type) {
    case "bilingual":
      return (
        <TranslatableField
          label={field.label}
          helper={field.helper}
          value={value || { en: "", ar: "" }}
          onChange={onChange}
          arManual={arManual}
          onArManualChange={onArManualChange}
        />
      );

    case "bilingual-textarea":
      return (
        <TranslatableField
          label={field.label}
          helper={field.helper}
          value={value || { en: "", ar: "" }}
          onChange={onChange}
          multiline
          rows={4}
          arManual={arManual}
          onArManualChange={onArManualChange}
        />
      );

    case "text":
      return (
        <div className="naa-se-field">
          <label className="naa-se-label">{field.label}</label>
          {field.helper && <p className="naa-se-helper">{field.helper}</p>}
          <input
            type="text"
            className="naa-se-input"
            value={value ?? ""}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.helper || ""}
          />
        </div>
      );

    case "textarea":
      return (
        <div className="naa-se-field">
          <label className="naa-se-label">{field.label}</label>
          {field.helper && <p className="naa-se-helper">{field.helper}</p>}
          <textarea
            className="naa-se-textarea"
            rows={4}
            value={value ?? ""}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.helper || ""}
          />
        </div>
      );

    case "number":
      return (
        <div className="naa-se-field">
          <label className="naa-se-label">{field.label}</label>
          {field.helper && <p className="naa-se-helper">{field.helper}</p>}
          <input
            type="number"
            className="naa-se-input naa-se-input-num"
            value={value ?? ""}
            onChange={(e) => { const n = parseFloat(e.target.value); onChange(isNaN(n) ? 0 : n); }}
            step="any"
          />
        </div>
      );

    case "boolean":
      return (
        <div className="naa-se-field naa-se-field-check">
          <label className="naa-se-check-label">
            <input type="checkbox" className="naa-se-check" checked={!!value} onChange={(e) => onChange(e.target.checked)} />
            <span>{field.label}</span>
          </label>
          {field.helper && <p className="naa-se-helper">{field.helper}</p>}
        </div>
      );

    case "color":
      return (
        <div className="naa-se-field">
          <label className="naa-se-label">{field.label}</label>
          {field.helper && <p className="naa-se-helper">{field.helper}</p>}
          <div className="naa-se-color-row">
            <input type="color" className="naa-se-color-swatch" value={value || "#000000"} onChange={(e) => onChange(e.target.value)} />
            <input type="text" className="naa-se-input naa-se-color-text" value={value || ""} onChange={(e) => onChange(e.target.value)} placeholder="#rrggbb" maxLength={7} />
          </div>
        </div>
      );

    case "image":
      return <ImageUpload sectionKey={sectionKey} value={value ?? null} onChange={onChange} label={field.label} />;

    case "repeater":
      return (
        <RepeaterField
          field={field}
          value={Array.isArray(value) ? value : []}
          onChange={onChange}
          sectionKey={sectionKey}
          arManualKeys={arManualKeys}
          onArManualChange={onArManualChange_full}
          fieldPrefix={fieldPrefix}
        />
      );

    default:
      return null;
  }
}

function RepeaterField({ field, value, onChange, sectionKey, arManualKeys, onArManualChange, fieldPrefix }) {
  const rows = Array.isArray(value) ? value : [];
  const addRow = () => onChange([...rows, { ...(field.defaultRow || {}) }]);
  const updateRow = (i, updated) => onChange(rows.map((r, idx) => (idx === i ? updated : r)));
  const removeRow = (i) => onChange(rows.filter((_, idx) => idx !== i));

  return (
    <div className="naa-se-repeater">
      <div className="naa-se-repeater-head">
        <span className="naa-se-label">{field.label}</span>
        <button type="button" className="naa-admin-btn naa-admin-btn-ghost naa-se-repeater-add" onClick={addRow}>
          + {field.addLabel || "Add row"}
        </button>
      </div>

      {rows.length === 0 && (
        <div className="naa-se-repeater-empty">No rows yet — click to add one.</div>
      )}

      {rows.map((row, i) => (
        <div className="naa-se-repeater-row" key={i}>
          <div className="naa-se-repeater-row-head">
            <span className="naa-se-repeater-row-num">{i + 1}</span>
            <button type="button" className="naa-admin-btn naa-admin-btn-danger-outline naa-se-repeater-del" onClick={() => removeRow(i)} title="Remove">✕</button>
          </div>
          <div className="naa-se-repeater-row-body">
            <StructuredEditor
              fields={field.subFields}
              value={row}
              onChange={(updated) => updateRow(i, updated)}
              sectionKey={sectionKey}
              arManualKeys={arManualKeys}
              onArManualChange={onArManualChange}
              fieldPrefix={`${fieldPrefix}.${i}`}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
