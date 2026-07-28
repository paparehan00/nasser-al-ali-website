import { motion, useScroll, useSpring, useReducedMotion } from "framer-motion";

// Thin reading-progress bar fixed to the very top of the viewport (public
// site only; mounted from Layout). Scroll-linked rather than autonomous
// motion, so it stays visible under prefers-reduced-motion; only the
// spring smoothing is dropped there.
export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const spring = useSpring(scrollYProgress, { stiffness: 220, damping: 34, mass: 0.4 });
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className="scroll-progress"
      style={{ scaleX: reduceMotion ? scrollYProgress : spring }}
      aria-hidden="true"
    />
  );
}
