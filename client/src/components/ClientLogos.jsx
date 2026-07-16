import { useI18n } from "../context/I18nContext.jsx";
import { useContent, pickLang } from "../hooks/useContent.js";

export default function ClientLogos() {
  const { lang } = useI18n();
  const { data } = useContent("clients");
  const section = data?.section;
  const items = data?.items || [];

  return (
    <section className="trusted-by section-alt" id="clients">
      <div className="container">
        <div className="section-header center">
          <span className="overline">{pickLang(section?.overline, lang)}</span>
          <h2>{pickLang(section?.title, lang)}</h2>
          <p className="section-lede">{pickLang(section?.lede, lang)}</p>
        </div>
        <div className="logos-grid">
          {items.map((l) => (
            <div className="logo-item" key={l.id}>
              <img src={l.imagePath} alt={l.data?.name} loading="lazy" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
