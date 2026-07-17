import { useEffect, useRef, useCallback } from "react";

/**
 * HorizontalCarousel — infinite auto-scroll carousel with drag/swipe,
 * gold scrubber, and arrow buttons. Pure-DOM position updates (no React
 * state for the hot path) keep animation smooth at 60 fps.
 *
 * Props:
 *   items        – array of data items to render
 *   renderItem   – (item, originalIndex) => JSX for each slide
 *   slideWidth   – px width of each slide (required for scrubber maths)
 *   gap          – px gap between slides (default 24)
 *   autoSpeed    – px/sec for auto-scroll, 0 = disabled (default 45)
 *   label        – aria-label for the carousel region
 *   className    – extra class on the outer wrapper
 */
export default function HorizontalCarousel({
  items,
  renderItem,
  slideWidth,
  gap = 24,
  autoSpeed = 45,
  label = "Carousel",
  className = "",
}) {
  const vpRef    = useRef(null);   // viewport div (overflow:hidden)
  const trackRef = useRef(null);   // wide flex track
  const scrubRef = useRef(null);   // <input type=range>
  const s        = useRef({        // mutable hot state — never triggers re-render
    pos: 0,
    singleW: 0,
    paused: false,
    dragging: false,
    dragX: 0,
    dragPos: 0,
    lastTs: null,
    raf: null,
  });

  // Each set is repeated 3× so the user can drag freely in both directions.
  const tripled = [...items, ...items, ...items];

  // ── Measure single-set width after mount / resize ───────────────────────
  const measure = useCallback(() => {
    if (!items.length) return;
    const sw = items.length * (slideWidth + gap);
    s.current.singleW = sw;
    // Bootstrap position to the middle copy so we can go left or right freely.
    if (s.current.pos === 0) s.current.pos = sw;
  }, [items.length, slideWidth, gap]);

  useEffect(() => {
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [measure]);

  // ── Apply position to DOM (called every frame) ───────────────────────────
  const applyPos = useCallback(() => {
    if (!trackRef.current) return;
    trackRef.current.style.transform = `translateX(${-s.current.pos}px)`;

    // Sync scrubber — position within one set (0 → singleW)
    if (scrubRef.current && s.current.singleW > 0) {
      const within = ((s.current.pos % s.current.singleW) + s.current.singleW) % s.current.singleW;
      scrubRef.current.value = (within / s.current.singleW) * 100;
    }
  }, []);

  // ── Wrap position so we never hit the edges ──────────────────────────────
  const wrap = useCallback(() => {
    const sw = s.current.singleW;
    if (!sw) return;
    // Keep pos inside [sw, 2·sw) so copies on both sides are always available.
    if (s.current.pos >= 2 * sw) s.current.pos -= sw;
    if (s.current.pos < 0)       s.current.pos += sw;
    // After wrap it might still be out of range — loop once more is enough.
    if (s.current.pos >= 2 * sw) s.current.pos -= sw;
    if (s.current.pos < 0)       s.current.pos += sw;
  }, []);

  // ── RAF animation loop ───────────────────────────────────────────────────
  const tick = useCallback((ts) => {
    const st = s.current;
    if (autoSpeed > 0 && !st.paused && !st.dragging) {
      const dt = st.lastTs ? Math.min((ts - st.lastTs) / 1000, 0.05) : 0;
      st.pos += autoSpeed * dt;
      wrap();
    }
    st.lastTs = ts;
    applyPos();
    st.raf = requestAnimationFrame(tick);
  }, [autoSpeed, wrap, applyPos]);

  useEffect(() => {
    s.current.raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(s.current.raf);
  }, [tick]);

  // ── Pointer drag (mouse + touch via pointer events) ───────────────────────
  const onPointerDown = (e) => {
    if (e.button > 1) return;
    vpRef.current?.setPointerCapture(e.pointerId);
    const st = s.current;
    st.dragging  = true;
    st.dragX     = e.clientX;
    st.dragPos   = st.pos;
    st.lastTs    = null;
  };
  const onPointerMove = (e) => {
    if (!s.current.dragging) return;
    const delta = s.current.dragX - e.clientX;
    s.current.pos = s.current.dragPos + delta;
    wrap();
    applyPos();
  };
  const onPointerUp = () => {
    s.current.dragging = false;
    s.current.lastTs   = null;
  };

  // Hover pause
  const onMouseEnter = () => { s.current.paused = true;  s.current.lastTs = null; };
  const onMouseLeave = () => { s.current.paused = false; s.current.lastTs = null; };

  // Keyboard arrows
  const onKeyDown = (e) => {
    const step = slideWidth + gap;
    if (e.key === "ArrowRight") { s.current.pos += step; wrap(); applyPos(); }
    if (e.key === "ArrowLeft")  { s.current.pos -= step; wrap(); applyPos(); }
  };

  // ── Arrow buttons ─────────────────────────────────────────────────────────
  const step = (dir) => {
    s.current.pos += dir * (slideWidth + gap);
    wrap();
    applyPos();
    s.current.lastTs = null;
  };

  // ── Scrubber ──────────────────────────────────────────────────────────────
  const onScrub = (e) => {
    const sw = s.current.singleW;
    if (!sw) return;
    const pct = parseFloat(e.target.value) / 100;
    // Keep in the middle copy so wrap never teleports the user.
    s.current.pos = sw + pct * sw;
    applyPos();
    s.current.lastTs = null;
  };
  const onScrubStart = () => { s.current.paused = true; };
  const onScrubEnd   = () => { s.current.paused = false; s.current.lastTs = null; };

  return (
    <div className={`hc ${className}`} aria-label={label} role="region">
      <div
        ref={vpRef}
        className="hc-viewport"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onKeyDown={onKeyDown}
        tabIndex={0}
        aria-label={`${label} — use arrow keys or drag to scroll`}
      >
        <div
          ref={trackRef}
          className="hc-track"
          style={{ gap: `${gap}px` }}
          aria-live="off"
        >
          {tripled.map((item, i) => {
            const origIdx = i % items.length;
            const isReal  = i >= items.length && i < 2 * items.length;
            return (
              <div
                key={`${origIdx}-${Math.floor(i / items.length)}`}
                className="hc-slide"
                aria-hidden={isReal ? undefined : "true"}
              >
                {renderItem(item, origIdx)}
              </div>
            );
          })}
        </div>
      </div>

      <div className="hc-controls" aria-label="Carousel controls">
        <button
          type="button"
          className="hc-arrow"
          onClick={() => step(-1)}
          aria-label="Scroll left"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true"><path d="M15 18l-6-6 6-6"/></svg>
        </button>

        <input
          ref={scrubRef}
          type="range"
          min="0"
          max="100"
          defaultValue="0"
          step="0.1"
          className="hc-scrubber"
          aria-label="Scroll position"
          onChange={onScrub}
          onMouseDown={onScrubStart}
          onTouchStart={onScrubStart}
          onMouseUp={onScrubEnd}
          onTouchEnd={onScrubEnd}
        />

        <button
          type="button"
          className="hc-arrow"
          onClick={() => step(1)}
          aria-label="Scroll right"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true"><path d="M9 18l6-6-6-6"/></svg>
        </button>
      </div>
    </div>
  );
}
