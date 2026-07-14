import { useI18n } from "../context/I18nContext.jsx";

export default function ChairmanSection() {
  const { t } = useI18n();
  return (
    <section className="chairman section-alt" id="chairman">
      <div className="container chairman-container">
        <div className="chairman-photo">
          <div className="chairman-photo-inner">
            <img src="/assets/chairman.png" alt={`${t("chairman.name")} - ${t("chairman.role")}`} loading="lazy" />
          </div>
          <div className="chairman-name-plate">
            <div className="plate-name">{t("chairman.name")}</div>
            <div className="plate-title">{t("chairman.role")}</div>
          </div>
        </div>
        <div className="chairman-content">
          <span className="overline">{t("chairman.overline")}</span>
          <h2>{t("chairman.title")}</h2>
          <blockquote className="chairman-quote">
            <svg className="quote-mark" viewBox="0 0 40 40" aria-hidden="true"><path d="M8 28c0-8 5-14 12-16v4c-4 2-7 6-7 10h7v12H8V28zm18 0c0-8 5-14 12-16v4c-4 2-7 6-7 10h7v12H26V28z" fill="currentColor"/></svg>
            <p>{t("chairman.p1")}</p>
            <p>{t("chairman.p2")}</p>
            <footer className="quote-signoff">{t("chairman.signoff")}</footer>
          </blockquote>
        </div>
      </div>
    </section>
  );
}
