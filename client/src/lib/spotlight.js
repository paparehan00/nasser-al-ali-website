// Pointer-tracked spotlight highlight for glass cards (pairs with the
// .service-card/.chart-card/.kpi-card ::after rules in global.css).
// One delegated document listener instead of per-card handlers, in the
// same spirit as tiltEffect.js: components opt in purely via their
// existing class names, no JSX changes needed.
const SELECTOR = ".service-card, .chart-card, .kpi-card";

export function initSpotlight() {
  // Touch devices and reduced-motion users never see the effect (the CSS
  // is also gated behind the same media queries), so skip the listener.
  if (
    typeof window === "undefined" ||
    !window.matchMedia("(hover: hover) and (pointer: fine)").matches
  ) {
    return () => {};
  }

  const onPointerMove = (e) => {
    const card = e.target.closest?.(SELECTOR);
    if (!card) return;
    const rect = card.getBoundingClientRect();
    card.style.setProperty("--spot-x", `${(e.clientX - rect.left).toFixed(1)}px`);
    card.style.setProperty("--spot-y", `${(e.clientY - rect.top).toFixed(1)}px`);
  };

  document.addEventListener("pointermove", onPointerMove, { passive: true });
  return () => document.removeEventListener("pointermove", onPointerMove);
}
