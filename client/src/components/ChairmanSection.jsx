import { useI18n } from "../context/I18nContext.jsx";
import { useContent, pickLang } from "../hooks/useContent.js";
import { useInView } from "../hooks/useInView.js";
import { tiltHandlers } from "../lib/tiltEffect.js";

export default function ChairmanSection() {
  const { lang } = useI18n();
  const [ref, inView] = useInView(0.2);
  const { data } = useContent("chairman");
  const section = data?.section;
  const extra = section?.extra || {};
  const name = pickLang(extra.name, lang);
  const role = pickLang(extra.role, lang);
  const photo = extra.imagePath || "/assets/chairman.jpeg";

  return (
    <section className="chairman section-alt" id="chairman">
      <div className="container chairman-container" ref={ref}>
        <div className="chairman-photo">
          <div className={"chairman-photo-inner tilt-frame clip-reveal" + (inView ? " is-in" : "")} {...tiltHandlers}>
            <img src={photo} alt={`${name} - ${role}`} loading="lazy"  decoding="sync" />
          </div>
          <div className="chairman-name-plate">
            <div className="plate-name">{name}</div>
            <div className="plate-title">{role}</div>
          </div>
        </div>
        <div className={"chairman-content fade-rise" + (inView ? " is-in" : "")}>
          {/* No overline — "Chairman's Message" above "A word from our
              Chairman" was the same statement twice; the heading alone
              already says it. */}
          <h2>{pickLang(section?.title, lang)}</h2>
          <blockquote className="chairman-quote">
            <svg className="quote-mark quote-mark-open" viewBox="0 0 40 40" aria-hidden="true"><path d="M8 28c0-8 5-14 12-16v4c-4 2-7 6-7 10h7v12H8V28zm18 0c0-8 5-14 12-16v4c-4 2-7 6-7 10h7v12H26V28z" fill="currentColor"/></svg>
            <p>{pickLang(extra.p1, lang)}</p>
            <p>{pickLang(extra.p2, lang)}</p>
            <svg className="quote-mark quote-mark-close" viewBox="0 0 40 40" aria-hidden="true"><path d="M8 28c0-8 5-14 12-16v4c-4 2-7 6-7 10h7v12H8V28zm18 0c0-8 5-14 12-16v4c-4 2-7 6-7 10h7v12H26V28z" fill="currentColor"/></svg>
            <footer className="quote-signoff">{pickLang(extra.signoff, lang)}</footer>
          </blockquote>
        </div>
      </div>
    </section>
  );
}
