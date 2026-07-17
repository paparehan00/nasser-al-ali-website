import { lazy, Suspense, useEffect, useMemo, useRef, useState } from "react";
import { ContentOverrideContext } from "../../contexts/ContentOverrideContext.jsx";
import { I18nOverride } from "../../context/I18nContext.jsx";

const PREVIEW_MAP = {
  hero:           lazy(() => import("../../components/Hero.jsx")),
  stats:          lazy(() => import("../../components/StatBar.jsx")),
  chairman:       lazy(() => import("../../components/ChairmanSection.jsx")),
  services:       lazy(() => import("../../components/ServicesGrid.jsx")),
  numbers:        lazy(() => import("../../components/NumbersSection.jsx")),
  clients:        lazy(() => import("../../components/ClientLogos.jsx")),
  projects:       lazy(() => import("../../components/ProjectsMasonry.jsx")),
  gallery:        lazy(() => import("../../components/CivilGallery.jsx")),
  certifications: lazy(() => import("../../components/CertificationsGrid.jsx")),
  awards:         lazy(() => import("../../components/AwardsGallery.jsx")),
  reviews:        lazy(() => import("../../components/ReviewsSection.jsx")),
};

// Ordered list of selectors that map to rendered items in each public component.
// First selector with enough children wins.
const ITEM_SELECTORS = [
  ".service-card",
  ".logo-item",
  ".project-card",
  ".cert-card",
  ".award-item",
  ".review-card",
  ".stat-item",
  ".carousel-item",
  ".kpi-card",
  ".bar-values text", // numbers bars
];

function scrollPreviewToItem(scrollEl, stageEl, idx) {
  if (!scrollEl || !stageEl || idx < 0) return;

  let targetEl = null;
  for (const sel of ITEM_SELECTORS) {
    const nodes = stageEl.querySelectorAll(sel);
    if (nodes.length > idx) { targetEl = nodes[idx]; break; }
  }
  if (!targetEl) return;

  // Compute targetEl's offset from the top of the scroll container.
  const containerRect = scrollEl.getBoundingClientRect();
  const targetRect    = targetEl.getBoundingClientRect();
  const relTop        = targetRect.top - containerRect.top + scrollEl.scrollTop;
  const center        = relTop + targetRect.height / 2 - scrollEl.clientHeight / 2;
  scrollEl.scrollTo({ top: Math.max(0, center), behavior: "smooth" });

  // Flash-highlight
  targetEl.classList.add("naa-preview-item-flash");
  const cleanup = setTimeout(() => targetEl.classList.remove("naa-preview-item-flash"), 1500);
  return () => clearTimeout(cleanup);
}

// editingIdx: 0-based index of the item currently open in the editor panel,
// or null/undefined when no item is being edited.
export default function LivePreview({ sectionKey, draft, editingIdx }) {
  const [lang, setLang] = useState("en");
  const [viewport, setViewport] = useState("desktop");

  const scrollRef = useRef(null);
  const stageRef  = useRef(null);

  const PreviewComponent = PREVIEW_MAP[sectionKey] ?? null;

  const overrideMap = useMemo(
    () => (draft ? { [sectionKey]: draft } : null),
    [sectionKey, draft]
  );

  // Auto-scroll + highlight the item that is currently being edited,
  // 400ms after editingIdx changes (giving the 300ms debounced preview time to render).
  useEffect(() => {
    if (editingIdx == null || editingIdx < 0) return;
    const timer = setTimeout(
      () => scrollPreviewToItem(scrollRef.current, stageRef.current, editingIdx),
      420
    );
    return () => clearTimeout(timer);
  }, [editingIdx, draft]); // re-run when draft updates too (image upload, etc.)

  return (
    <div className="naa-preview-pane">
      <div className="naa-preview-bar">
        <span className="naa-preview-title">Live preview</span>

        <div className="naa-preview-controls">
          <div className="naa-preview-toggle-group" role="group" aria-label="Viewport">
            <button
              type="button"
              className={"naa-preview-toggle" + (viewport === "desktop" ? " is-active" : "")}
              onClick={() => setViewport("desktop")}
              title="Desktop width"
            >
              &#9635; Desktop
            </button>
            <button
              type="button"
              className={"naa-preview-toggle" + (viewport === "mobile" ? " is-active" : "")}
              onClick={() => setViewport("mobile")}
              title="Mobile width (~390 px)"
            >
              &#9633; Mobile
            </button>
          </div>

          <div className="naa-preview-toggle-group" role="group" aria-label="Language">
            <button
              type="button"
              className={"naa-preview-toggle" + (lang === "en" ? " is-active" : "")}
              onClick={() => setLang("en")}
            >
              EN
            </button>
            <button
              type="button"
              className={"naa-preview-toggle" + (lang === "ar" ? " is-active" : "")}
              onClick={() => setLang("ar")}
            >
              AR
            </button>
          </div>
        </div>
      </div>

      {/* scrollRef wraps the scrollable area; stageRef wraps the rendered component */}
      <div
        ref={scrollRef}
        className={"naa-preview-scroll" + (lang === "ar" ? " is-rtl" : "")}
      >
        <div
          ref={stageRef}
          className={"naa-preview-stage" + (viewport === "mobile" ? " is-mobile" : "")}
        >
          {!PreviewComponent ? (
            <div className="naa-preview-unavailable">
              Preview not available for <code>{sectionKey}</code>
            </div>
          ) : !overrideMap ? (
            <div className="naa-preview-loading">Loading…</div>
          ) : (
            <ContentOverrideContext.Provider value={overrideMap}>
              <I18nOverride lang={lang}>
                <Suspense fallback={<div className="naa-preview-loading">Rendering…</div>}>
                  <PreviewComponent />
                </Suspense>
              </I18nOverride>
            </ContentOverrideContext.Provider>
          )}
        </div>
      </div>
    </div>
  );
}
