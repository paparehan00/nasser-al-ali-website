// Shared mouse-tilt handlers for the ".tilt-frame" photo effect (pairs with
// the CSS in global.css). Plain event handlers rather than a hook so the
// same pair can be spread onto elements rendered inside .map() without
// running into the rules-of-hooks "can't call a hook in a loop" problem.
const MAX_DEG = 8;

export function tiltMove(e) {
  const el = e.currentTarget;
  const rect = el.getBoundingClientRect();
  if (!rect.width || !rect.height) return;
  const x = (e.clientX - rect.left) / rect.width;
  const y = (e.clientY - rect.top) / rect.height;
  el.style.setProperty("--tilt-x", `${((0.5 - y) * MAX_DEG * 2).toFixed(2)}deg`);
  el.style.setProperty("--tilt-y", `${((x - 0.5) * MAX_DEG * 2).toFixed(2)}deg`);
  el.style.setProperty("--glare-x", `${(x * 100).toFixed(1)}%`);
  el.style.setProperty("--glare-y", `${(y * 100).toFixed(1)}%`);
  el.style.setProperty("--glare-opacity", "1");
}

export function tiltLeave(e) {
  const el = e.currentTarget;
  el.style.setProperty("--tilt-x", "0deg");
  el.style.setProperty("--tilt-y", "0deg");
  el.style.setProperty("--glare-opacity", "0");
}

export const tiltHandlers = { onMouseMove: tiltMove, onMouseLeave: tiltLeave };
