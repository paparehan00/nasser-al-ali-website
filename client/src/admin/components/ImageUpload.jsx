import { useCallback, useRef, useState } from "react";
import { useToast } from "../ToastContext.jsx";

// Sections whose policy is null on the server — image uploads disallowed.
const NO_UPLOAD_SECTIONS = new Set(["stats", "numbers"]);

export default function ImageUpload({ sectionKey, value, onChange }) {
  const toast = useToast();
  const inputRef = useRef(null);
  const [busy, setBusy] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const disabled = NO_UPLOAD_SECTIONS.has(sectionKey);

  const readCsrf = () => {
    const m = document.cookie.match(/(?:^|;\s*)naa_csrf=([^;]+)/);
    return m ? decodeURIComponent(m[1]) : "";
  };

  const doUpload = useCallback(async (file) => {
    if (!file) return;
    setBusy(true);
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch(`/api/admin/uploads/${sectionKey}`, {
        method: "POST",
        credentials: "same-origin",
        headers: { "x-csrf-token": readCsrf() },
        body: form,
      });
      const text = await res.text();
      let data = null;
      try { data = text ? JSON.parse(text) : null; } catch { /* ignore */ }
      if (!res.ok) {
        throw new Error(data?.error || `Upload failed (${res.status})`);
      }
      onChange(data.imagePath);
      toast.success(`Uploaded (${Math.round(data.bytes / 1024)} KB, ${data.format} q${data.quality}).`);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }, [sectionKey, onChange, toast]);

  const onPick = (e) => doUpload(e.target.files?.[0]);
  const onDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    doUpload(e.dataTransfer.files?.[0]);
  };
  const onDragOver = (e) => { e.preventDefault(); setDragOver(true); };
  const onDragLeave = () => setDragOver(false);
  const onClear = () => onChange(null);

  if (disabled) {
    return (
      <div className="naa-admin-field">
        <span>Image</span>
        <div className="naa-admin-empty">This section does not use per-item images.</div>
      </div>
    );
  }

  return (
    <div className="naa-admin-field">
      <span>Image</span>

      {value ? (
        <div className="naa-admin-imgrow">
          <div className="naa-admin-imgpreview">
            <img src={value} alt="Current" onError={(e) => { e.currentTarget.style.opacity = 0.3; }} />
          </div>
          <div className="naa-admin-imgmeta">
            <code className="naa-admin-imgpath">{value}</code>
            <div className="naa-admin-imgbtns">
              <button type="button" className="naa-admin-btn naa-admin-btn-ghost" onClick={() => inputRef.current?.click()} disabled={busy}>
                {busy ? "Uploading…" : "Replace"}
              </button>
              <button type="button" className="naa-admin-btn naa-admin-btn-danger-outline" onClick={onClear} disabled={busy}>
                Remove
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div
          className={"naa-admin-dropzone" + (dragOver ? " is-drag" : "") + (busy ? " is-busy" : "")}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onClick={() => !busy && inputRef.current?.click()}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => { if ((e.key === "Enter" || e.key === " ") && !busy) inputRef.current?.click(); }}
        >
          {busy ? "Uploading…" : "Drop an image here, or click to pick one"}
          <div className="naa-admin-dropzone-sub">JPG, PNG, WebP or GIF · will be re-encoded &amp; stripped of metadata</div>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        onChange={onPick}
        style={{ display: "none" }}
      />
    </div>
  );
}
