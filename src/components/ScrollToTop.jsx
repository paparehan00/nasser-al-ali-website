import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// Scroll to top of the page on every route change.
// If the URL has a hash (e.g. /#about), let the browser handle it (no-op here).
export default function ScrollToTop() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) return;
    // Instant on route change - the site's own scroll animations feel weird
    // when combined with a smooth scroll here.
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname, hash]);
  return null;
}
