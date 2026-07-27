import { useEffect, useRef, useState } from "react";
import { useI18n } from "../context/I18nContext.jsx";

// Renders a single interactive 3D model via <model-viewer> (a web component,
// not a React component — the custom element is registered globally once
// the library loads). Loaded on demand (dynamic import) so the ~90KB
// model-viewer runtime only ever ships to pages that actually use it, never
// bloating the main site bundle.
export default function Model3DViewer({ src, alt, cameraOrbit, credit, compact = false }) {
  const { t } = useI18n();
  const [ready, setReady] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const elRef = useRef(null);

  useEffect(() => {
    let cancelled = false;
    import("@google/model-viewer").then(() => {
      if (!cancelled) setReady(true);
    });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    const el = elRef.current;
    if (!ready || !el) return;
    const onLoad = () => setLoaded(true);
    el.addEventListener("load", onLoad);
    return () => el.removeEventListener("load", onLoad);
  }, [ready]);

  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  return (
    <div className={"model3d-wrap" + (compact ? " model3d-wrap-compact" : "")}>
      <div className={"model3d-stage" + (loaded ? " is-loaded" : "")}>
        {ready && (
          // eslint-disable-next-line react/no-unknown-property
          <model-viewer
            ref={elRef}
            src={src}
            alt={alt}
            camera-orbit={cameraOrbit}
            camera-controls
            touch-action="pan-y"
            {...(prefersReducedMotion ? {} : { "auto-rotate": true, "rotation-per-second": "16deg" })}
            interaction-prompt="none"
            shadow-intensity="1"
            exposure="1.05"
            environment-image="neutral"
            disable-zoom
            class="model3d-el"
          />
        )}
        {!loaded && (
          <div className="model3d-loading" aria-hidden="true">
            <div className="model3d-spinner" />
          </div>
        )}
      </div>
      <div className="model3d-hint">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M9 11l-2 2 2 2M15 11l2 2-2 2M12 3v2M12 19v2" />
          <circle cx="12" cy="12" r="8" />
        </svg>
        <span>{t("model3d.hint")}</span>
      </div>
      {credit && (
        <p className="model3d-credit">
          {t("model3d.creditPrefix")}{" "}
          <a href={credit.url} target="_blank" rel="noopener noreferrer">{credit.name}</a>
          {" "}(CC BY 3.0)
        </p>
      )}
    </div>
  );
}
