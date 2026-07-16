import { useI18n } from "../context/I18nContext.jsx";
import { useContent, pickLang } from "../hooks/useContent.js";

export default function CertificationsGrid({ onOpen }) {
  const { lang } = useI18n();
  const { data } = useContent("certifications");

  const section = data?.section;
  const items = data?.items || [];
  const extra = section?.extra || {};

  return (
    <section className="certifications" id="certifications">
      <div className="container">
        <div className="section-header center">
          <span className="overline">{pickLang(section?.overline, lang)}</span>
          <h2>{pickLang(section?.title, lang)}</h2>
          <p className="section-lede">{pickLang(section?.lede, lang)}</p>
        </div>
        <div className="certs-grid">
          {items.map((c) => {
            const d = c.data || {};
            const localizedTitle = pickLang(d.title, lang);
            return (
              <a
                className="cert-card"
                key={c.id}
                href={c.imagePath}
                onClick={(e) => {
                  e.preventDefault();
                  onOpen && onOpen(c.imagePath, `${d.code} - ${localizedTitle}`);
                }}
              >
                <div className="cert-thumb">
                  <img src={c.imagePath} alt={d.alt} loading="lazy" />
                </div>
                <div className="cert-body">
                  <div className="cert-code">{d.code}</div>
                  <div className="cert-title">{localizedTitle}</div>
                  <div className="cert-desc">{pickLang(d.desc, lang)}</div>
                  <div className="cert-meta">
                    <span>{pickLang(extra.certNoLabel, lang)} {d.certNo}</span>
                    <span>{pickLang(extra.validLabel, lang)} {extra.validUntil}</span>
                  </div>
                  <div className="cert-issuer">{pickLang(extra.issuer, lang)}</div>
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
