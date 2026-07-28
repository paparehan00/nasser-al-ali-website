import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { scrollToTarget } from "../lib/lenis.js";

// Section content (services, projects, etc.) is fetched async from the API,
// so the target element often doesn't exist yet on the first render after a
// route change — poll briefly instead of relying on one-shot browser-native
// hash scrolling, which doesn't reliably fire on SPA route changes anyway.
const MAX_ATTEMPTS = 40; // ~4s at 100ms
const POLL_MS = 100;

// Scrolls to the top of the page on every route change, or — when the URL
// has a `#hash` (e.g. a mega-menu link to /about#chairman) — scrolls to
// that section once it exists in the DOM. Uses scrollIntoView so each
// target's own `scroll-margin-top` (see global.css) handles the fixed
// header offset, including page-specific cases like the Gallery page's
// extra sticky sub-nav.
export default function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) {
      // Route changes land at the top instantly; animating a full-page
      // scroll on every navigation reads as lag, not polish.
      scrollToTarget(0, { smooth: false });
      return;
    }

    const id = hash.slice(1);
    let attempts = 0;
    let timer = null;

    const tryScroll = () => {
      const el = document.getElementById(id);
      if (el) {
        scrollToTarget(el);
        return;
      }
      attempts += 1;
      if (attempts < MAX_ATTEMPTS) {
        timer = setTimeout(tryScroll, POLL_MS);
      }
    };
    timer = setTimeout(tryScroll, 50);

    return () => { if (timer) clearTimeout(timer); };
  }, [pathname, hash]);

  return null;
}
