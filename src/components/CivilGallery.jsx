import { useEffect, useRef } from "react";
import { useI18n } from "../context/I18nContext.jsx";

const IMAGES = [
  "civil_1.jpg","civil_2.jpg","civil_3.jpg","civil_4.jpg","civil_5.jpg",
  "civil_6.jpg","civil_7.jpg","civil_8.jpg","civil_9.jpg","civil_10.jpg",
  "civil_11.jpg","civil_13.jpg","civil_14.jpg","civil_15.jpg",
];

export default function CivilGallery({ onOpen }) {
  const { t } = useI18n();
  const trackRef = useRef(null);
  const posRef = useRef(0);
  const rafRef = useRef(0);

  // Simple continuous auto-scroll marquee. Duplicates items so it wraps.
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let last = performance.now();
    let paused = false;
    const speed = 40; // px/sec

    const step = (now) => {
      const dt = (now - last) / 1000; last = now;
      if (!paused) {
        posRef.current += speed * dt;
        const halfWidth = track.scrollWidth / 2;
        if (halfWidth > 0 && posRef.current >= halfWidth) posRef.current -= halfWidth;
        track.style.transform = `translateX(-${posRef.current}px)`;
      }
      rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);

    const onEnter = () => { paused = true; };
    const onLeave = () => { paused = false; last = performance.now(); };
    track.addEventListener("mouseenter", onEnter);
    track.addEventListener("mouseleave", onLeave);
    return () => {
      cancelAnimationFrame(rafRef.current);
      track.removeEventListener("mouseenter", onEnter);
      track.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  const items = [...IMAGES, ...IMAGES];

  return (
    <section className="gallery section-alt" id="gallery">
      <div className="container">
        <div className="section-header">
          <span className="overline">{t("gallery.overline")}</span>
          <h2>{t("gallery.title")}</h2>
          <p className="section-lede">{t("gallery.lede")}</p>
        </div>
      </div>
      <div className="carousel-container">
        <div className="carousel-track" ref={trackRef}>
          {items.map((f, i) => (
            <div
              className="carousel-item"
              key={i}
              onClick={() => onOpen && onOpen(`/assets/${f}`, `Civil work ${(i % IMAGES.length) + 1}`)}
            >
              <img src={`/assets/${f}`} alt="Civil Work" loading="lazy" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
