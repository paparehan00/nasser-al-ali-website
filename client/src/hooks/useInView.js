import { useCallback, useRef, useState } from "react";

// Shared scroll-reveal trigger — true once the ref'd element crosses the
// given viewport threshold, then disconnects (fires once, never re-hides).
//
// Uses a callback ref rather than a plain useRef: the target element is
// often conditionally rendered (e.g. only once async content has loaded),
// so a plain ref can still be null when the mount effect runs and never
// gets a second chance to attach. A callback ref re-fires exactly when the
// DOM node actually appears, regardless of when that happens.
export function useInView(threshold = 0.25, rootMargin = "0px") {
  const [inView, setInView] = useState(false);
  const obsRef = useRef(null);

  const ref = useCallback((node) => {
    if (obsRef.current) {
      obsRef.current.disconnect();
      obsRef.current = null;
    }
    if (!node) return;
    if (!("IntersectionObserver" in window)) { setInView(true); return; }
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) { setInView(true); obs.disconnect(); }
        });
      },
      { threshold, rootMargin }
    );
    obs.observe(node);
    obsRef.current = obs;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [threshold, rootMargin]);

  return [ref, inView];
}
