// Lenis smooth-scroll singleton for the public site (the admin SPA never
// initializes it). Kept as a plain module rather than a hook so ScrollToTop
// and Layout can share the same instance without prop-drilling or context.
import Lenis from "lenis";

let lenis = null;
let rafId = null;

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Initializes Lenis and returns a cleanup function. No-ops (returning a
// no-op cleanup) when the user prefers reduced motion, so the site falls
// back to native scrolling untouched.
export function initLenis() {
  if (prefersReducedMotion() || lenis) return destroyLenis;

  lenis = new Lenis({
    lerp: 0.11,
    // ScrollToTop owns anchor/hash scrolling (it polls for async content),
    // so Lenis must not also intercept anchor clicks.
    anchors: false,
  });

  const raf = (time) => {
    if (!lenis) return;
    lenis.raf(time);
    rafId = requestAnimationFrame(raf);
  };
  rafId = requestAnimationFrame(raf);

  return destroyLenis;
}

export function destroyLenis() {
  if (rafId) cancelAnimationFrame(rafId);
  rafId = null;
  if (lenis) lenis.destroy();
  lenis = null;
}

// Unified programmatic scroll. Routes through Lenis when active (native
// smooth scrolling fights Lenis's own animation loop), falls back to the
// browser APIs otherwise. `target` is 0 (top) or an element. Honors each
// target's scroll-margin-top the same way scrollIntoView does, so the
// fixed-header offsets in global.css keep working.
export function scrollToTarget(target, { smooth = true } = {}) {
  const immediate = !smooth || prefersReducedMotion();

  if (lenis) {
    if (target === 0) {
      lenis.scrollTo(0, { immediate });
    } else {
      const marginTop = parseFloat(getComputedStyle(target).scrollMarginTop) || 0;
      lenis.scrollTo(target, { offset: -marginTop, immediate });
    }
    return;
  }

  const behavior = immediate ? "instant" : "smooth";
  if (target === 0) {
    window.scrollTo({ top: 0, left: 0, behavior });
  } else {
    target.scrollIntoView({ behavior, block: "start" });
  }
}
