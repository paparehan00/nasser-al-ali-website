import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useI18n } from "../context/I18nContext.jsx";
import { PHONE, PHONE_TEL } from "../lib/constants.js";

/**
 * Hero - video mode for mobile / reduced-motion / slow-network,
 * plus a poster fallback that shows instantly on all devices.
 * The old scroll-driven canvas frame scrub is dropped in the React
 * version - the video is smoother and the code much simpler.
 */
export default function Hero() {
  const { t } = useI18n();
  const videoRef = useRef(null);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = true;
    v.playsInline = true;
    v.controls = false;
    v.removeAttribute("controls");
    const tryPlay = () => v.play().catch(() => {
      const kick = () => v.play().catch(() => {});
      document.addEventListener("click", kick, { once: true });
      document.addEventListener("touchstart", kick, { once: true });
    });
    v.load();
    v.addEventListener("canplay", tryPlay, { once: true });
    return () => v.removeEventListener("canplay", tryPlay);
  }, []);

  return (
    <section className="hero" id="hero">
      <div className="hero-sticky">
        <div
          className="hero-fallback"
          id="hero-fallback"
          style={{ backgroundImage: 'url("/assets/hero-poster.jpg")' }}
        />
        <video
          ref={videoRef}
          className="hero-video is-active"
          id="hero-video"
          muted
          loop
          playsInline
          preload="auto"
          disablePictureInPicture
          aria-hidden="true"
          tabIndex={-1}
        >
          <source src="/assets/hero-1080.webm" type="video/webm" />
          <source src="/assets/hero-1080.mp4" type="video/mp4" />
        </video>

        <div className="hero-overlay">
          <div className="container hero-container">
            <div className="hero-content">
              <span className="overline hero-overline">{t("hero.overline")}</span>
              <h1 className="hero-title">{t("hero.title")}</h1>
              <p className="hero-subtitle">{t("hero.subtitle")}</p>
              <div className="hero-buttons">
                <Link to="/contact" className="btn btn-solid btn-gold btn-large">
                  {t("hero.btnProposal")}
                </Link>
                <Link to="/projects" className="btn btn-outline btn-white btn-large">
                  {t("hero.btnProjects")}
                </Link>
              </div>
              <div className="hero-phone">
                <a href={PHONE_TEL} className="phone-link">{PHONE}</a>
              </div>
            </div>
          </div>
          <div className="scroll-indicator">
            <div className="mouse">
              <div className="wheel" />
            </div>
            <span>{t("hero.scroll")}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
