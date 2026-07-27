import { useParams, Navigate, Link } from "react-router-dom";
import { useDocumentTitle } from "../hooks/useDocumentTitle.js";
import { useI18n } from "../context/I18nContext.jsx";
import { useContent, pickLang } from "../hooks/useContent.js";
import { useInView } from "../hooks/useInView.js";
import { SERVICE_DETAILS } from "../lib/serviceDetails.js";
import Model3DViewer from "../components/Model3DViewer.jsx";

function RevealSection({ id, className, children }) {
  const [ref, inView] = useInView(0.2);
  return (
    <section id={id} className={className}>
      <div className={"container mv-page-inner" + (inView ? " is-in-view" : "")} ref={ref}>
        <div className="reveal-up">{children}</div>
      </div>
    </section>
  );
}

// Full-bleed photo on one side, solid (never translucent) brand-navy panel
// on the other — the "why choose us" copy lives here instead of a separate
// section when a service has a photo, so the image never needs a dark
// overlay for text legibility: the two never share the same pixels.
function SplitFeature({ id, photo, title, heading, copy }) {
  const [ref, inView] = useInView(0.2);
  return (
    <section id={id} className="service-detail-split" ref={ref}>
      <div className="service-detail-split-media">
        <img src={photo} alt={title} loading="lazy" />
      </div>
      <div className="service-detail-split-panel">
        <div className={"service-detail-split-inner" + (inView ? " is-in-view" : "")}>
          <h2 className="mv-page-heading">{heading}</h2>
          <p className="service-detail-split-text">{copy}</p>
        </div>
      </div>
    </section>
  );
}

export default function ServiceDetail() {
  const { slug } = useParams();
  const { t, lang } = useI18n();
  const { data } = useContent("services");
  const detail = SERVICE_DETAILS[slug];

  const items = data?.items || [];
  const item = items.find((it) => it.data?.id === detail?.id);
  const d = item?.data || {};
  const title = detail ? (pickLang(d.title, lang) || detail.id) : "";

  useDocumentTitle(detail ? `${title} | Nasser Al Ali Enterprises` : "");

  if (!detail) return <Navigate to="/services" replace />;

  return (
    <div className="route-page service-detail-page">
      <section
        className="service-detail-hero"
        style={item?.imagePath ? { backgroundImage: `url("${item.imagePath}")` } : undefined}
      >
        <div className="service-detail-hero-overlay" />
        <div className="container service-detail-hero-inner">
          <span className="overline">{t("nav.services")}</span>
          <h1>{title}</h1>
          <p className="service-detail-tagline">{pickLang(detail.tagline, lang)}</p>
        </div>
      </section>

      <RevealSection id="overview" className="service-detail-block">
        <p className="service-detail-desc">{pickLang(detail.description, lang)}</p>
      </RevealSection>

      {detail.model3D && (
        <RevealSection id="model-3d" className="service-detail-block section-alt">
          <div className="section-header center">
            <span className="overline">{t("model3d.overline")}</span>
            <h2 className="mv-page-heading">{t("model3d.title")}</h2>
          </div>
          <Model3DViewer
            src={detail.model3D.src}
            alt={detail.model3D.alt}
            cameraOrbit={detail.model3D.cameraOrbit}
            credit={detail.model3D.credit}
          />
        </RevealSection>
      )}

      <RevealSection id="scope" className="service-detail-block">
        <h2 className="mv-page-heading">{t("serviceDetail.scopeHeading")}</h2>
        <ul className="service-detail-scope-list">
          {detail.scopeItems.map((s, i) => (
            <li key={i}>{pickLang(s, lang)}</li>
          ))}
        </ul>
      </RevealSection>

      {detail.photo ? (
        <SplitFeature
          id="why"
          photo={detail.photo}
          title={title}
          heading={t("serviceDetail.whyHeading")}
          copy={pickLang(detail.why, lang)}
        />
      ) : (
        <RevealSection id="why" className="service-detail-block section-alt">
          <h2 className="mv-page-heading">{t("serviceDetail.whyHeading")}</h2>
          <div className="mv-page-copy">
            <p>{pickLang(detail.why, lang)}</p>
          </div>
        </RevealSection>
      )}

      <section className="service-detail-cta section-alt">
        <div className="container service-detail-cta-inner">
          <h2>{pickLang(detail.ctaText, lang)}</h2>
          <Link to="/contact" className="btn btn-solid btn-gold btn-large">
            {t("nav.contact")}
          </Link>
        </div>
      </section>
    </div>
  );
}
