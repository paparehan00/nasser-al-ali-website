import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useI18n } from "../context/I18nContext.jsx";
import { useContent, pickLang } from "../hooks/useContent.js";

const DISMISS_KEY = "naa_promo_bar_dismissed";

// Slim, dismissible strip above the header — shows the latest active
// Promotions & Announcements item (admin CRM managed). Hidden entirely
// when there are no items, on the Contact page, or once dismissed for
// this browser session.
//
// While visible it grows --header-height (and sets --announce-height) on
// the root element by its own measured height, so the fixed header slides
// down to sit right below it instead of overlapping — every anchor-scroll
// offset and route-page top padding already derives from --header-height,
// so they all stay correct automatically without touching them directly.
export default function AnnouncementBar() {
  const { t, lang } = useI18n();
  const location = useLocation();
  const { data } = useContent("ads");
  const items = data?.items || [];
  const promo = items[0];

  const [dismissed, setDismissed] = useState(
    () => typeof window !== "undefined" && sessionStorage.getItem(DISMISS_KEY) === "1"
  );

  const isContactPage = location.pathname === "/contact";
  const visible = Boolean(promo) && !dismissed && !isContactPage;

  const barRef = useRef(null);

  useEffect(() => {
    const root = document.documentElement;

    if (!visible) {
      root.style.removeProperty("--header-height");
      root.style.removeProperty("--announce-height");
      return;
    }

    // Cache the *base* --header-height (before this bar adds to it) once,
    // instead of re-reading it via getComputedStyle on every call — that
    // read forces a synchronous layout, and this used to run on every
    // "resize" event. Mobile browsers fire "resize" repeatedly *during a
    // normal scroll gesture* (their address bar collapses/expands as you
    // scroll, which changes window.innerHeight), so re-forcing layout that
    // often was blocking the main thread mid-scroll — the exact cause of
    // the janky/stuttering scroll on mobile, especially noticeable right
    // as a scroll direction reverses near the top of the page.
    let baseHeaderHeight = null;
    let scheduled = false;

    const applyHeight = () => {
      scheduled = false;
      const h = barRef.current?.offsetHeight || 0;
      if (baseHeaderHeight === null) {
        root.style.removeProperty("--header-height");
        baseHeaderHeight = getComputedStyle(root).getPropertyValue("--header-height").trim();
      }
      root.style.setProperty("--header-height", `calc(${baseHeaderHeight} + ${h}px)`);
      root.style.setProperty("--announce-height", `${h}px`);
    };

    // Coalesces any number of rapid-fire events into at most one
    // recalculation per animation frame, instead of one per event.
    const scheduleApply = () => {
      if (scheduled) return;
      scheduled = true;
      requestAnimationFrame(applyHeight);
    };

    applyHeight();
    const ro = new ResizeObserver(scheduleApply);
    if (barRef.current) ro.observe(barRef.current);
    // Only the bar's own width can change its wrapped-text height, so only
    // width changes need a recheck — mobile "resize" events from the
    // address bar showing/hiding are purely height-only and are correctly
    // ignored here.
    let lastWidth = window.innerWidth;
    const onResize = () => {
      if (window.innerWidth === lastWidth) return;
      lastWidth = window.innerWidth;
      scheduleApply();
    };
    window.addEventListener("resize", onResize);

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", onResize);
      root.style.removeProperty("--header-height");
      root.style.removeProperty("--announce-height");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, promo?.id]);

  if (!visible) return null;

  const title = pickLang(promo.data?.title, lang);

  const dismiss = () => {
    sessionStorage.setItem(DISMISS_KEY, "1");
    setDismissed(true);
  };

  return (
    <div className="announce-bar" ref={barRef} role="region" aria-label={t("announce.aria")}>
      <div className="container announce-bar-inner">
        <span className="announce-bar-text">{title}</span>
        <Link to="/promotions" className="announce-bar-link">{t("announce.view")}</Link>
        <button
          type="button"
          className="announce-bar-close"
          aria-label={t("announce.dismiss")}
          onClick={dismiss}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>
      </div>
    </div>
  );
}
