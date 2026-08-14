"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";

const ICON_SIZE = 22;
const LOOP_RADIUS = 150;

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

function buildFlightPath(x0: number, y0: number, corner: Corner) {
  const overshoot = 120;
  const targets: Record<Corner, { x: number; y: number }> = {
    tl: { x: -overshoot, y: -overshoot },
    tr: { x: window.innerWidth + overshoot, y: -overshoot },
    bl: { x: -overshoot, y: window.innerHeight + overshoot },
    br: { x: window.innerWidth + overshoot, y: window.innerHeight + overshoot },
  };
  const end = targets[corner];
  const dx = end.x - x0;
  const dy = end.y - y0;
  const dist = Math.hypot(dx, dy);

  // Aim the loop's exit heading straight at the corner so the curve that
  // follows only has to bend gently, never reverse direction.
  const headingDeg = (Math.atan2(dy, dx) * 180) / Math.PI;
  const { d: loopD, lastC2 } = buildLoop(x0, y0, LOOP_RADIUS, headingDeg);
  const loop = `M ${x0},${y0} ${loopD}`;

  // Continue smoothly from the loop: same tangent direction as its exit
  // (mirroring the loop's last control point through (x0, y0), like SVG's
  // "S" would), but rescaled to the escape curve's own length. Reusing the
  // loop's short handle as-is would make the curve very tight for an
  // instant and then go nearly flat right after; a longer handle in the
  // same direction keeps the curvature gentle and continuous instead.
  const dirLen = Math.hypot(x0 - lastC2.x, y0 - lastC2.y);
  const dirX = (x0 - lastC2.x) / dirLen;
  const dirY = (y0 - lastC2.y) / dirLen;
  const handleLen = dist * 0.3;
  const c1x = x0 + dirX * handleLen;
  const c1y = y0 + dirY * handleLen;

  // A single straight bezier would sometimes read as a flat, ruler-straight
  // stretch. Bow the curve's second control point off to one side so it
  // always keeps a gentle, continuous curvature on the way out. Pick the
  // side that matches where the reflected control point already leans, so
  // both control points bow the same way and the curve never inflects
  // through a near-zero-curvature (visually straight) patch.
  const ux = dx / dist;
  const uy = dy / dist;
  const side =
    (c1x - x0) * -uy + (c1y - y0) * ux >= 0 ? 1 : -1;
  const px = -uy * side;
  const py = ux * side;
  const bow = dist * 0.4;
  const c2x = x0 + dx * 0.55 + px * bow;
  const c2y = y0 + dy * 0.55 + py * bow;

  const flight = `C ${c1x},${c1y} ${c2x},${c2y} ${end.x},${end.y}`;

  return `${loop} ${flight}`;
}

interface Dash {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  frac: number;
}

export default function PlaneLaunchIcon() {
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
    const corners: Corner[] = ["tl", "tr", "bl", "br"];
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
          width={ICON_SIZE}
          height={ICON_SIZE}
        />
      </motion.button>

      {flight && (
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
            width={ICON_SIZE}
            height={ICON_SIZE}
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
        </div>
      )}
    </>
  );
}
