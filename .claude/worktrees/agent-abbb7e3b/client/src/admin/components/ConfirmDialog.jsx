import { useEffect } from "react";

export default function ConfirmDialog({
  open,
  title = "Are you sure?",
  message,
  confirmLabel = "Delete",
  cancelLabel = "Cancel",
  onConfirm,
  onCancel,
  danger = true,
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === "Escape") onCancel?.(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onCancel]);

  if (!open) return null;
  return (
    <div className="naa-admin-modal-backdrop" onClick={onCancel}>
      <div className="naa-admin-modal" onClick={(e) => e.stopPropagation()}>
        <h2>{title}</h2>
        {message && <p>{message}</p>}
        <div className="naa-admin-modal-actions">
          <button type="button" className="naa-admin-btn naa-admin-btn-ghost" onClick={onCancel}>{cancelLabel}</button>
          <button
            type="button"
            className={`naa-admin-btn ${danger ? "naa-admin-btn-danger" : "naa-admin-btn-primary"}`}
            onClick={onConfirm}
            autoFocus
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
