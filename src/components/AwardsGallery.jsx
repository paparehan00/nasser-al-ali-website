import { useEffect, useState } from "react";
import { useI18n } from "../context/I18nContext.jsx";

const MAX = 60; // upper safety bound; probe stops at first miss

export default function AwardsGallery({ onOpen }) {
  const { t } = useI18n();
  const [urls, setUrls] = useState([]);

  useEffect(() => {
    let cancelled = false;
    const probe = (n) => new Promise((res) => {
      const im = new Image();
      const src = `/assets/awards/award-${String(n).padStart(2, "0")}.webp`;
      im.onload = () => res(src);
      im.onerror = () => res(null);
      im.src = src + "?p=1";
    });
    (async () => {
      const acc = [];
      for (let i = 1; i <= MAX && !cancelled; i++) {
        const src = await probe(i);
        if (!src) break;
        acc.push(src);
      }
      if (!cancelled) setUrls(acc);
    })();
    return () => { cancelled = true; };
  }, []);

  return (
    <section className="awards" id="awards">
      <div className="container">
        <div className="section-header center">
          <span className="overline">{t("awards.overline")}</span>
          <h2>{t("awards.title")}</h2>
          <p className="section-lede">{t("awards.lede")}</p>
        </div>

        {/* CSR subsection - three short pillars */}
        <div className="csr-block">
          <h3 className="csr-title">{t("awards.csr.title")}</h3>
          <div className="csr-grid">
            <p>{t("awards.csr.p1")}</p>
            <p>{t("awards.csr.p2")}</p>
            <p>{t("awards.csr.p3")}</p>
          </div>
        </div>

        {urls.length > 0 && (
          <>
            <div className="section-subhead">
              <span className="overline">{t("awards.galleryTitle")}</span>
            </div>
            <div className="awards-grid">
              {urls.map((src, i) => (
                <figure
                  className="award-item"
                  key={src}
                  onClick={() => onOpen && onOpen(src, `Chairman presenting a recognition award (${i + 1})`)}
                >
                  <div className="award-img-wrap">
                    <img src={src} alt={`Chairman presenting a recognition award to a team member (${i + 1})`} loading="lazy" />
                  </div>
                </figure>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
