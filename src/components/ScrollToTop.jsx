import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// Scroll to top of the page on every route change with a smooth transition
// so it feels like the rest of the site's motion.
// If the URL has a hash (e.g. /awards#gallery), let the browser handle it.
export default function ScrollToTop() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) return;
    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: prefersReduced ? "instant" : "smooth",
    });
  }, [pathname, hash]);
  return null;
}
