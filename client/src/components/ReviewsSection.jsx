import { useI18n } from "../context/I18nContext.jsx";
import { MAP_LINK } from "../lib/constants.js";
import { useContent, pickLang } from "../hooks/useContent.js";

const GOOGLE_SVG = (
  <svg width="12" height="12" viewBox="0 0 24 24" aria-hidden="true">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.99.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.61z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z"/>
  </svg>
);

// Split a fractional rating (e.g. 4.6) into 4 filled stars + one partial star
// filled to (0.6 * 100)% and any trailing empty stars, matching the legacy layout.
function starRow(rating) {
  const full = Math.floor(rating);
  const partial = rating - full;
  return { full, partial, empty: Math.max(0, 5 - full - (partial > 0 ? 1 : 0)) };
}

export default function ReviewsSection() {
  const { lang } = useI18n();
  const { data } = useContent("reviews");
  const section = data?.section;
  const items = data?.items || [];
  const extra = section?.extra || {};
  const rating = typeof extra.rating === "number" ? extra.rating : 4.6;
  const count = typeof extra.count === "number" ? extra.count : 0;
  const stars = starRow(rating);
  const ratingWhole = Math.floor(rating);
  const ratingDecimal = Math.round((rating - ratingWhole) * 10);

  return (
    <section className="reviews" id="reviews">
      <div className="container">
        <div className="section-header center">
          <span className="overline">{pickLang(section?.overline, lang)}</span>
          <h2>{pickLang(section?.title, lang)}</h2>
          <p className="section-lede">{pickLang(section?.lede, lang)}</p>
        </div>

        <div className="reviews-layout">
          <aside className="rating-summary">
            <div className="rating-google">
              <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.99.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.61z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z"/>
              </svg>
              <span>{pickLang(extra.gLabel, lang)}</span>
            </div>
            <div className="rating-value">{ratingWhole}.{ratingDecimal}<span className="rating-of">/5</span></div>
            <div className="rating-stars" aria-hidden="true">
              {Array.from({ length: stars.full }).map((_, i) => (
                <span key={`f${i}`} className="star star-full">★</span>
              ))}
              {stars.partial > 0 && (
                <span className="star star-partial" style={{ "--fill": `${Math.round(stars.partial * 100)}%` }}>★</span>
              )}
              {Array.from({ length: stars.empty }).map((_, i) => (
                <span key={`e${i}`} className="star">★</span>
              ))}
            </div>
            <div className="rating-count">{pickLang(extra.basedOn, lang)} <strong>{count} {pickLang(extra.reviewsWord, lang)}</strong></div>
            <a className="rating-cta" href={MAP_LINK} target="_blank" rel="noopener noreferrer">
              {pickLang(extra.readAll, lang)}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M7 17L17 7M7 7h10v10"/></svg>
            </a>
          </aside>

          <div className="reviews-cards">
            {items.map((r) => {
              const d = r.data || {};
              return (
                <article className="review-card" key={r.id}>
                  <header className="review-head">
                    <div className="review-avatar" style={{ background: d.color }}>{d.init}</div>
                    <div className="review-who">
                      <div className="review-name">{d.name}</div>
                      <div className="review-meta">{d.meta}</div>
                    </div>
                  </header>
                  <div className="review-stars" aria-label="5 out of 5 stars">★★★★★</div>
                  <p className="review-body">"{d.quote}"</p>
                  <footer className="review-foot">{GOOGLE_SVG} Posted on Google</footer>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
