import { useI18n } from "../context/I18nContext.jsx";
import { MAP_LINK } from "../lib/constants.js";

const GOOGLE_SVG = (
  <svg width="12" height="12" viewBox="0 0 24 24" aria-hidden="true">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.99.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.61z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z"/>
  </svg>
);

const REVIEWS = [
  { init: "T", color: "#4A6486", name: "Tariq Khan",       meta: "3 years ago",
    quote: "May Allah grant Nasser Al Ali a long life. I have never seen a well-wisher of a master and worker like him." },
  { init: "L", color: "#C9A24B", name: "Ledo Mohara",      meta: "Local Guide · 426 reviews · 7 years ago",
    quote: "Good manpower supply organization." },
  { init: "F", color: "#8AA0BF", name: "Farhan Hussain",   meta: "2 reviews · 1 year ago",
    quote: "I know this company is very good." },
  { init: "R", color: "#D9B76A", name: "Raju Khatri",      meta: "12 reviews · 5 years ago",
    quote: "Good service." },
  { init: "S", color: "#4A6486", name: "Sitaram Gautam",   meta: "1 review · 5 years ago",
    quote: "Good, best company." },
  { init: "N", color: "#C9A24B", name: "Narayan Subedi",   meta: "1 review · 7 years ago",
    quote: "Good company." },
];

export default function ReviewsSection() {
  const { t } = useI18n();
  return (
    <section className="reviews" id="reviews">
      <div className="container">
        <div className="section-header center">
          <span className="overline">{t("reviews.overline")}</span>
          <h2>{t("reviews.title")}</h2>
          <p className="section-lede">{t("reviews.lede")}</p>
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
              <span>{t("reviews.gLabel")}</span>
            </div>
            <div className="rating-value">4.6<span className="rating-of">/5</span></div>
            <div className="rating-stars" aria-hidden="true">
              <span className="star star-full">★</span>
              <span className="star star-full">★</span>
              <span className="star star-full">★</span>
              <span className="star star-full">★</span>
              <span className="star star-partial" style={{ "--fill": "60%" }}>★</span>
            </div>
            <div className="rating-count">{t("reviews.basedOn")} <strong>35 {t("reviews.reviews")}</strong></div>
            <a className="rating-cta" href={MAP_LINK} target="_blank" rel="noopener noreferrer">
              {t("reviews.readAll")}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M7 17L17 7M7 7h10v10"/></svg>
            </a>
          </aside>

          <div className="reviews-cards">
            {REVIEWS.map((r, i) => (
              <article className="review-card" key={i}>
                <header className="review-head">
                  <div className="review-avatar" style={{ background: r.color }}>{r.init}</div>
                  <div className="review-who">
                    <div className="review-name">{r.name}</div>
                    <div className="review-meta">{r.meta}</div>
                  </div>
                </header>
                <div className="review-stars" aria-label="5 out of 5 stars">★★★★★</div>
                <p className="review-body">"{r.quote}"</p>
                <footer className="review-foot">{GOOGLE_SVG} Posted on Google</footer>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
