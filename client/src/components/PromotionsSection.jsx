import { useI18n } from "../context/I18nContext.jsx";
import { useContent, pickLang } from "../hooks/useContent.js";
import { useInView } from "../hooks/useInView.js";

const MEGAPHONE_ICON = (
  <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M6 17v6a2 2 0 0 0 2 2h2l4 8V7l-4 8H8a2 2 0 0 0-2 2Z" />
    <path d="M22 12v16" />
    <path d="M22 12c5-2 8-5 10-8v24c-2-3-5-6-10-8" />
  </svg>
);

export default function PromotionsSection() {
  const { t, lang } = useI18n();
  const { data } = useContent("ads");
  const section = data?.section;
  const posters = data?.items || [];
  const [gridRef, gridInView] = useInView(0.15);

  return (
    <section className="promotions" id="promotions">
      <div className="container">
        <div className="section-header center">
          <span className="overline">{pickLang(section?.overline, lang)}</span>
          <h2>{pickLang(section?.title, lang)}</h2>
          <p className="section-lede">{pickLang(section?.lede, lang)}</p>
        </div>

        {posters.length > 0 ? (
          <div className={"promo-grid" + (gridInView ? " is-in-view" : "")} ref={gridRef}>
            {posters.map((p, i) => {
              const d = p.data || {};
              const title = pickLang(d.title, lang);
              const Wrap = d.link ? "a" : "div";
              const wrapProps = d.link ? { href: d.link, target: "_blank", rel: "noopener noreferrer" } : {};
              return (
                <Wrap
                  className="promo-card reveal-up"
                  key={p.id}
                  style={{ "--reveal-delay": `${Math.min(i, 6) * 70}ms` }}
                  {...wrapProps}
                >
                  <div className="promo-card-img">
                    <img src={p.imagePath} alt={title || "Promotion"} loading="lazy"  decoding="sync" />
                  </div>
                  {title && <div className="promo-card-title">{title}</div>}
                </Wrap>
              );
            })}
          </div>
        ) : (
          <div className="promotions-empty">
            <div className="promotions-empty-icon">{MEGAPHONE_ICON}</div>
            <h3>{t("promotions.empty")}</h3>
            <p>{t("promotions.emptyBody")}</p>
          </div>
        )}
      </div>
    </section>
  );
}
