import { useState } from "react";
import { useI18n } from "../context/I18nContext.jsx";
import { useContent, pickLang } from "../hooks/useContent.js";
import Lightbox from "../components/Lightbox.jsx";
import { tiltHandlers } from "../lib/tiltEffect.js";
import { useDocumentTitle } from "../hooks/useDocumentTitle.js";
import { ROUTE_TITLES } from "../lib/constants.js";

export default function Gallery() {
  useDocumentTitle(ROUTE_TITLES["/gallery"]);
  const { lang, t } = useI18n();
  const [lb, setLb] = useState({ src: "", alt: "" });

  const { data: clientData }  = useContent("clients");
  const { data: projectData } = useContent("projects");
  const { data: awardData }   = useContent("awards");

  const clients  = clientData?.items  || [];
  const projects = projectData?.items || [];
  const awards   = awardData?.items   || [];

  const open  = (src, alt) => setLb({ src, alt });
  const close = () => setLb({ src: "", alt: "" });

  return (
    <div className="route-page gallery-page">
      {/* Page header */}
      <div className="gallery-hero">
        <div className="container">
          <span className="overline">{t("gallery.overline")}</span>
          <h1>{t("gallery.title")}</h1>
          <p className="section-lede">{t("gallery.lede")}</p>
        </div>
      </div>

      {/* Sticky section tabs */}
      <nav className="gallery-tabs" aria-label="Gallery sections">
        <div className="container gallery-tabs-inner">
          <a href="#gallery-clients"  className="gallery-tab">{t("gallery.clients")}</a>
          <a href="#gallery-projects" className="gallery-tab">{t("gallery.projects")}</a>
          <a href="#gallery-awards"   className="gallery-tab">{t("gallery.awardsCSR")}</a>
        </div>
      </nav>

      {/* ── Our Clients ─────────────────────────────────────────── */}
      <section className="gallery-section" id="gallery-clients">
        <div className="container">
          <div className="section-header center">
            <span className="overline">{t("gallery.clientsOverline")}</span>
            <h2>{t("gallery.clients")}</h2>
            <p className="section-lede">{t("gallery.clientsLede")}</p>
          </div>
          {clients.length > 0 ? (
            <div className="gallery-logo-grid">
              {clients.map((c) => (
                <div className="gallery-logo-item" key={c.id}>
                  <img
                    src={c.imagePath}
                    alt={c.data?.name || "Client logo"}
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="gallery-empty">{t("gallery.loading")}</div>
          )}
        </div>
      </section>

      {/* ── Featured Projects ────────────────────────────────────── */}
      <section className="gallery-section section-alt" id="gallery-projects">
        <div className="container">
          <div className="section-header center">
            <span className="overline">{t("gallery.projectsOverline")}</span>
            <h2>{t("gallery.projects")}</h2>
            <p className="section-lede">{t("gallery.projectsLede")}</p>
          </div>
          {projects.length > 0 ? (
            <div className="gallery-photo-grid">
              {projects.map((p) => {
                const d = p.data || {};
                const name = pickLang(d.name, lang) || d.name || "Project";
                const loc  = pickLang(d.location, lang) || d.location || "";
                return (
                  <figure
                    className="gallery-photo-item"
                    key={p.id}
                    role="button"
                    tabIndex={0}
                    onClick={() => open(p.imagePath, name)}
                    onKeyDown={(e) => e.key === "Enter" && open(p.imagePath, name)}
                    aria-label={`View ${name}`}
                  >
                    <div className="gallery-photo-wrap tilt-frame" {...tiltHandlers}>
                      <img src={p.imagePath} alt={name} loading="lazy" />
                    </div>
                    {(name || loc) && (
                      <figcaption className="gallery-photo-caption">
                        {name && <strong>{name}</strong>}
                        {loc  && <span>{loc}</span>}
                      </figcaption>
                    )}
                  </figure>
                );
              })}
            </div>
          ) : (
            <div className="gallery-empty">{t("gallery.loading")}</div>
          )}
        </div>
      </section>

      {/* ── Awards & CSR ─────────────────────────────────────────── */}
      <section className="gallery-section" id="gallery-awards">
        <div className="container">
          <div className="section-header center">
            <span className="overline">{t("gallery.awardsOverline")}</span>
            <h2>{t("gallery.awardsCSR")}</h2>
            <p className="section-lede">{t("gallery.awardsLede")}</p>
          </div>
          {awards.length > 0 ? (
            <div className="gallery-photo-grid">
              {awards.map((a, i) => (
                <figure
                  className="gallery-photo-item"
                  key={a.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => open(a.imagePath, `Award recognition ${i + 1}`)}
                  onKeyDown={(e) => e.key === "Enter" && open(a.imagePath, `Award recognition ${i + 1}`)}
                  aria-label={`View award ${i + 1}`}
                >
                  <div className="gallery-photo-wrap tilt-frame" {...tiltHandlers}>
                    <img src={a.imagePath} alt={`Award recognition ${i + 1}`} loading="lazy" />
                  </div>
                </figure>
              ))}
            </div>
          ) : (
            <div className="gallery-empty">{t("gallery.loading")}</div>
          )}
        </div>
      </section>

      <Lightbox src={lb.src} alt={lb.alt} onClose={close} />
    </div>
  );
}
