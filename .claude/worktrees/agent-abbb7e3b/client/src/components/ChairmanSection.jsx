import { useI18n } from "../context/I18nContext.jsx";
import { useContent, pickLang } from "../hooks/useContent.js";

export default function ChairmanSection() {
  const { lang } = useI18n();
  const { data } = useContent("chairman");
  const section = data?.section;
  const extra = section?.extra || {};
  const name = pickLang(extra.name, lang);
  const role = pickLang(extra.role, lang);
  const photo = extra.imagePath || "/assets/chairman.png";

  return (
    <section className="chairman section-alt" id="chairman">
      <div className="container chairman-container">
        <div className="chairman-photo">
          <div className="chairman-photo-inner">
            <img src={photo} alt={`${name} - ${role}`} loading="lazy" />
          </div>
          <div className="chairman-name-plate">
            <div className="plate-name">{name}</div>
            <div className="plate-title">{role}</div>
          </div>
        </div>
        <div className="chairman-content">
          <span className="overline">{pickLang(section?.overline, lang)}</span>
          <h2>{pickLang(section?.title, lang)}</h2>
          <blockquote className="chairman-quote">
            <svg className="quote-mark" viewBox="0 0 40 40" aria-hidden="true"><path d="M8 28c0-8 5-14 12-16v4c-4 2-7 6-7 10h7v12H8V28zm18 0c0-8 5-14 12-16v4c-4 2-7 6-7 10h7v12H26V28z" fill="currentColor"/></svg>
            <p>{pickLang(extra.p1, lang)}</p>
            <p>{pickLang(extra.p2, lang)}</p>
            <footer className="quote-signoff">{pickLang(extra.signoff, lang)}</footer>
          </blockquote>
        </div>
      </div>
    </section>
  );
}
