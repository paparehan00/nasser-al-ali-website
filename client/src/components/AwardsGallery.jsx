import { useI18n } from "../context/I18nContext.jsx";
import { useContent, pickLang } from "../hooks/useContent.js";

export default function AwardsGallery({ onOpen }) {
  const { lang } = useI18n();
  const { data } = useContent("awards");
  const section = data?.section;
  const items = data?.items || [];
  const extra = section?.extra || {};

  return (
    <section className="awards" id="awards">
      <div className="container">
        <div className="section-header center">
          <span className="overline">{pickLang(section?.overline, lang)}</span>
          <h2>{pickLang(section?.title, lang)}</h2>
          <p className="section-lede">{pickLang(section?.lede, lang)}</p>
        </div>

        {/* CSR subsection - three short pillars */}
        <div className="csr-block">
          <h3 className="csr-title">{pickLang(extra.csrTitle, lang)}</h3>
          <div className="csr-grid">
            <p>{pickLang(extra.csrP1, lang)}</p>
            <p>{pickLang(extra.csrP2, lang)}</p>
            <p>{pickLang(extra.csrP3, lang)}</p>
          </div>
        </div>

        {items.length > 0 && (
          <>
            <div className="section-subhead">
              <span className="overline">{pickLang(extra.galleryTitle, lang)}</span>
            </div>
            <div className="awards-grid">
              {items.map((it, i) => {
                const alt = it.data?.alt || `Chairman presenting a recognition award to a team member (${i + 1})`;
                return (
                  <figure
                    className="award-item"
                    key={it.id}
                    onClick={() => onOpen && onOpen(it.imagePath, `Chairman presenting a recognition award (${i + 1})`)}
                  >
                    <div className="award-img-wrap">
                      <img src={it.imagePath} alt={alt} loading="lazy" />
                    </div>
                  </figure>
                );
              })}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
