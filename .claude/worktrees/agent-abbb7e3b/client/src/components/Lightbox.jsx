import { useEffect } from "react";

export default function Lightbox({ src, alt, onClose }) {
  useEffect(() => {
    if (!src) return;
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [src, onClose]);

  if (!src) return null;
  return (
    <div
      className="lightbox active"
      onClick={(e) => { if (e.currentTarget === e.target) onClose(); }}
      role="dialog"
      aria-modal="true"
    >
      <button className="lightbox-close" aria-label="Close lightbox" onClick={onClose}>×</button>
      <img src={src} alt={alt || "Fullscreen image"} id="lightbox-img" />
    </div>
  );
}
