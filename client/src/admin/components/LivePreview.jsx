import { lazy, Suspense, useMemo, useState } from "react";
import { ContentOverrideContext } from "../../contexts/ContentOverrideContext.jsx";
import { I18nOverride } from "../../context/I18nContext.jsx";

// Lazily load each public section component. They'll have public CSS available
// since this admin SPA shares the same bundle & global.css.
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

export default function LivePreview({ sectionKey, draft }) {
  const [lang, setLang] = useState("en");
  const [viewport, setViewport] = useState("desktop"); // "desktop" | "mobile"

  const PreviewComponent = PREVIEW_MAP[sectionKey] ?? null;

  // The override map only needs one key — for this section.
  const overrideMap = useMemo(
    () => (draft ? { [sectionKey]: draft } : null),
    [sectionKey, draft]
  );

  return (
    <div className="naa-preview-pane">
      <div className="naa-preview-bar">
        <span className="naa-preview-title">Live preview</span>

        <div className="naa-preview-controls">
          {/* Viewport toggle */}
          <div className="naa-preview-toggle-group" role="group" aria-label="Preview viewport">
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

          {/* Language toggle */}
          <div className="naa-preview-toggle-group" role="group" aria-label="Preview language">
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

      <div className={"naa-preview-scroll" + (lang === "ar" ? " is-rtl" : "")}>
        <div className={"naa-preview-stage" + (viewport === "mobile" ? " is-mobile" : "")}>
          {!PreviewComponent ? (
            <div className="naa-preview-unavailable">
              Preview not available for <code>{sectionKey}</code>
            </div>
          ) : !overrideMap ? (
            <div className="naa-preview-unavailable">Loading…</div>
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
