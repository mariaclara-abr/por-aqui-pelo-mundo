"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion } from "motion/react";

const DEFAULT_ICON_SIZE = 22;
const LOOP_RADIUS = 150;
const LOOP_EDGE_BUFFER = 24;

const FLIGHT_DURATION = 6;
const DASH_APPEAR = 0.1;
const DASH_HOLD = 1.1;
const DASH_FADE = 0.8;
const DASH_CYCLE = DASH_APPEAR + DASH_HOLD + DASH_FADE;
const DASH_GAP_DELAY = 0.06;
const TOTAL_DURATION = FLIGHT_DURATION + DASH_GAP_DELAY + DASH_CYCLE;
const DASH_COUNT = 46;
const DASH_LENGTH = 12;

type Corner = "tl" | "tr" | "bl" | "br";

// Traces a full circle back to (x0, y0) using four tangent-continuous cubic
// arcs, so the loop has uniform curvature (no pinch point) instead of the
// sharp turn a single closed bezier produces at its start/end. The whole
// loop is rotated around (x0, y0) so it exits already heading toward
// `headingDeg`, avoiding a sharp reversal in the curve that follows.
function buildLoop(x0: number, y0: number, r: number, headingDeg: number) {
  const cx = x0;
  const cy = y0 - r;
  const k = (4 / 3) * Math.tan(Math.PI / 8); // magic number for a 90° arc
  const angles = [90, 0, -90, -180, -270].map((deg) => (deg * Math.PI) / 180);
  const h = (headingDeg * Math.PI) / 180;
  const cosH = Math.cos(h);
  const sinH = Math.sin(h);
  const rotate = (px: number, py: number) => ({
    x: x0 + (px - x0) * cosH - (py - y0) * sinH,
    y: y0 + (px - x0) * sinH + (py - y0) * cosH,
  });

  let d = "";
  let lastC2 = { x: x0, y: y0 };
  for (let i = 0; i < 4; i++) {
    const a0 = angles[i];
    const a1 = angles[i + 1];
    const p1 = rotate(cx + r * Math.cos(a1), cy + r * Math.sin(a1));
    const c1 = rotate(
      cx + r * Math.cos(a0) + k * r * Math.sin(a0),
      cy + r * Math.sin(a0) - k * r * Math.cos(a0),
    );
    const c2 = rotate(
      cx + r * Math.cos(a1) - k * r * Math.sin(a1),
      cy + r * Math.sin(a1) + k * r * Math.cos(a1),
    );
    d += `C ${c1.x},${c1.y} ${c2.x},${c2.y} ${p1.x},${p1.y} `;
    lastC2 = c2;
  }
  return { d: d.trim(), lastC2 };
}

function clamp(value: number, lo: number, hi: number) {
  return Math.min(Math.max(value, lo), hi);
}

function buildFlightPath(x0: number, y0: number, corner: Corner) {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const overshoot = 120;
  const targets: Record<Corner, { x: number; y: number }> = {
    tl: { x: -overshoot, y: -overshoot },
    tr: { x: vw + overshoot, y: -overshoot },
    bl: { x: -overshoot, y: vh + overshoot },
    br: { x: vw + overshoot, y: vh + overshoot },
  };
  const end = targets[corner];

  // Heading from the click point straight toward the exit target. Only used
  // to orient the loop when there's no approach segment (loop sits right on
  // the click point, see `entryHeadingDeg` below) — reusing it whenever an
  // approach segment exists would aim that segment's arrival at the exit
  // corner instead of at the loop it's actually flying into, which can point
  // in a completely different (even near-opposite) direction and forces a
  // sharp last-second turn right at the loop's entrance.
  const headingDeg = (Math.atan2(end.y - y0, end.x - x0) * 180) / Math.PI;

  // The click point always sits on the loop circle, so the loop's own
  // farthest reach from it is the circle's diameter (2r), whichever way it
  // ends up rotated. Shrinking r so 2r plus a buffer always fits inside the
  // viewport guarantees the loop itself can never be clipped, even when the
  // button sits right next to an edge (e.g. the header logo) or the
  // viewport is a narrow phone screen.
  const r = Math.max(
    32,
    Math.min(
      LOOP_RADIUS,
      (vw - LOOP_EDGE_BUFFER * 2) / 4,
      (vh - LOOP_EDGE_BUFFER * 2) / 4,
    ),
  );
  const margin = 2 * r + LOOP_EDGE_BUFFER;

  // If the click point itself has room, the loop happens right where the
  // plane was clicked, same as before. If it's too close to an edge for the
  // loop to fit, slide the loop inland until it clears every edge by
  // `margin`, and have the plane fly a short approach curve to it first, so
  // the loop (and the animation's visible middle stretch) always happens
  // on-screen instead of only the very end of the flight being visible.
  const loopX = clamp(x0, margin, vw - margin);
  const loopY = clamp(y0, margin, vh - margin);

  let approach = "";
  const approachDist = Math.hypot(loopX - x0, loopY - y0);
  // The loop is oriented to enter (and, since it's a closed loop, exit)
  // along this heading. When there's a real approach segment, that heading
  // must be the direction the plane is actually already travelling in — the
  // straight line from the click point to the loop — so the approach curve
  // arrives with a matching tangent instead of swerving into some unrelated
  // direction right before the loop. Only when the loop sits on the click
  // point itself (no approach) is there no such constraint, so it's free to
  // face the exit corner instead.
  const entryHeadingDeg =
    approachDist > 1
      ? (Math.atan2(loopY - y0, loopX - x0) * 180) / Math.PI
      : headingDeg;
  const hx = Math.cos((entryHeadingDeg * Math.PI) / 180);
  const hy = Math.sin((entryHeadingDeg * Math.PI) / 180);
  if (approachDist > 1) {
    const c1x = x0 + (loopX - x0) * 0.35;
    const c1y = y0 + (loopY - y0) * 0.35;
    // Arrive at the loop moving along `entryHeadingDeg`, matching the loop's
    // own entry tangent, and keep the handle short enough to stay inside the
    // safe rect (all four bezier control points in-viewport guarantees the
    // curve itself never leaves the viewport either, by the convex hull
    // property).
    const handleLen = Math.min(Math.max(20, approachDist * 0.35), margin * 0.9);
    const c2x = loopX - hx * handleLen;
    const c2y = loopY - hy * handleLen;
    approach = `C ${c1x},${c1y} ${c2x},${c2y} ${loopX},${loopY} `;
  }

  const { d: loopD, lastC2 } = buildLoop(loopX, loopY, r, entryHeadingDeg);
  const path = `M ${x0},${y0} ${approach}${loopD}`;

  const dx = end.x - loopX;
  const dy = end.y - loopY;
  const dist = Math.hypot(dx, dy);

  // Continue smoothly from the loop: same tangent direction as its exit
  // (mirroring the loop's last control point through the loop center, like
  // SVG's "S" would), but rescaled to the escape curve's own length. Reusing
  // the loop's short handle as-is would make the curve very tight for an
  // instant and then go nearly flat right after; a longer handle in the
  // same direction keeps the curvature gentle and continuous instead.
  const dirLen = Math.hypot(loopX - lastC2.x, loopY - lastC2.y);
  const dirX = (loopX - lastC2.x) / dirLen;
  const dirY = (loopY - lastC2.y) / dirLen;
  const handleLen = dist * 0.3;
  const c1x = loopX + dirX * handleLen;
  const c1y = loopY + dirY * handleLen;

  // A single straight bezier would sometimes read as a flat, ruler-straight
  // stretch. Bow the curve's second control point off to one side so it
  // always keeps a gentle, continuous curvature on the way out. Pick the
  // side that matches where the reflected control point already leans, so
  // both control points bow the same way and the curve never inflects
  // through a near-zero-curvature (visually straight) patch. Kept shallow
  // so the bow doesn't push the plane past the edge earlier than it has to.
  const ux = dx / dist;
  const uy = dy / dist;
  const side =
    (c1x - loopX) * -uy + (c1y - loopY) * ux >= 0 ? 1 : -1;
  const px = -uy * side;
  const py = ux * side;
  const bow = dist * 0.2;
  const c2x = loopX + dx * 0.55 + px * bow;
  const c2y = loopY + dy * 0.55 + py * bow;

  const flight = `C ${c1x},${c1y} ${c2x},${c2y} ${end.x},${end.y}`;

  return `${path} ${flight}`;
}

interface Dash {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  frac: number;
}

export default function PlaneLaunchIcon({
  size = DEFAULT_ICON_SIZE,
}: {
  size?: number;
}) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const timeoutsRef = useRef<number[]>([]);
  const [flight, setFlight] = useState<{ d: string; dashes: Dash[] } | null>(
    null,
  );
  const [iconHidden, setIconHidden] = useState(false);

  useEffect(() => {
    return () => {
      timeoutsRef.current.forEach((id) => window.clearTimeout(id));
    };
  }, []);

  const handleClick = () => {
    if (flight) return;
    const el = buttonRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const x0 = rect.left + rect.width / 2;
    const y0 = rect.top + rect.height / 2;
    // Exclude the corner the plane already started in front of: flying out
    // toward it would mean doubling back the way it came, which forces a
    // sharp turn onto the escape curve to still land there in one smooth
    // piece. Every other corner keeps the exit roughly ahead of the plane.
    const ownCorner = ((y0 < window.innerHeight / 2 ? "t" : "b") +
      (x0 < window.innerWidth / 2 ? "l" : "r")) as Corner;
    const corners = (["tl", "tr", "bl", "br"] as Corner[]).filter(
      (c) => c !== ownCorner,
    );
    const corner = corners[Math.floor(Math.random() * corners.length)];
    const d = buildFlightPath(x0, y0, corner);

    setIconHidden(true);
    setFlight({ d, dashes: [] });

    requestAnimationFrame(() => {
      const p = pathRef.current;
      if (!p) return;
      const total = p.getTotalLength();
      const dashLenFrac = DASH_LENGTH / total;
      const dashes = Array.from({ length: DASH_COUNT }, (_, i) => {
        const frac = i / (DASH_COUNT - 1);
        const start = p.getPointAtLength(frac * total);
        const end = p.getPointAtLength(
          Math.min(1, frac + dashLenFrac) * total,
        );
        return { x1: start.x, y1: start.y, x2: end.x, y2: end.y, frac };
      });
      setFlight((current) => (current ? { ...current, dashes } : current));
    });

    timeoutsRef.current.push(
      window.setTimeout(() => setFlight(null), TOTAL_DURATION * 1000),
      window.setTimeout(() => setIconHidden(false), TOTAL_DURATION * 1000),
    );
  };

  return (
    <>
      <motion.button
        ref={buttonRef}
        type="button"
        onClick={handleClick}
        aria-label="Fazer o avião voar pela tela"
        className="shrink-0 cursor-pointer"
        animate={{ opacity: iconHidden ? 0 : 1 }}
        transition={{ duration: iconHidden ? 0.15 : 0.6, ease: "easeOut" }}
      >
        <img
          src="/assets/simbolo.svg"
          alt=""
          width={size}
          height={size}
        />
      </motion.button>

      {flight &&
        createPortal(
          <div className="pointer-events-none fixed inset-0 z-[999] overflow-hidden">
            <svg className="h-full w-full">
              <path ref={pathRef} d={flight.d} fill="none" stroke="none" />
              {flight.dashes.map((dash, i) => (
                <motion.line
                  key={i}
                  x1={dash.x1}
                  y1={dash.y1}
                  x2={dash.x2}
                  y2={dash.y2}
                  stroke="#C1653A"
                  strokeWidth={2.5}
                  strokeLinecap="round"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 1, 1, 0] }}
                  transition={{
                    duration: DASH_CYCLE,
                    times: [
                      0,
                      DASH_APPEAR / DASH_CYCLE,
                      (DASH_APPEAR + DASH_HOLD) / DASH_CYCLE,
                      1,
                    ],
                    delay: dash.frac * FLIGHT_DURATION + DASH_GAP_DELAY,
                    ease: "easeOut",
                  }}
                />
              ))}
            </svg>
            <motion.img
              src="/assets/simbolo.svg"
              alt=""
              width={size}
              height={size}
              className="absolute left-0 top-0"
              style={{
                offsetPath: `path("${flight.d}")`,
                offsetRotate: "auto 70deg",
                offsetAnchor: "50% 50%",
              }}
              initial={{ offsetDistance: "0%" }}
              animate={{ offsetDistance: "100%" }}
              transition={{ duration: FLIGHT_DURATION, ease: "linear" }}
            />
          </div>,
          document.body,
        )}
    </>
  );
}
