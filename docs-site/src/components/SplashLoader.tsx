import { useEffect, useState } from "react";

/**
 * Boot splash for the docs app — ported from the "draw" variant of
 * `YJSG Splash.dc.html` (design: strokes draw, mode: once, cycle: 5s,
 * chrome: hidden).
 *
 * Mounted once in `main.tsx`, outside the router, so it plays on every full
 * document load/refresh and is unaffected by client-side route navigation.
 * It is intentionally NOT gated behind localStorage/sessionStorage and does
 * not redirect anywhere — it just overlays the app for one draw cycle, then
 * fades out and unmounts to reveal the real UI underneath.
 */

const CYCLE_MS = 5000;
const FADE_MS = 400;
const REDUCED_MOTION_HOLD_MS = 450;

type SplashPhase = "playing" | "leaving" | "done";

export function SplashLoader() {
  const [phase, setPhase] = useState<SplashPhase>("playing");

  useEffect(() => {
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const holdMs = prefersReducedMotion ? REDUCED_MOTION_HOLD_MS : CYCLE_MS;
    const fadeMs = prefersReducedMotion ? 200 : FADE_MS;

    const leaveTimer = window.setTimeout(() => setPhase("leaving"), holdMs);
    const doneTimer = window.setTimeout(
      () => setPhase("done"),
      holdMs + fadeMs,
    );

    return () => {
      window.clearTimeout(leaveTimer);
      window.clearTimeout(doneTimer);
    };
  }, []);

  if (phase === "done") return null;

  return (
    <div
      className={
        "docs-splash" +
        (phase === "leaving" ? " docs-splash--leaving" : "")
      }
      aria-hidden="true"
    >
      <span className="docs-visually-hidden" role="status">
        Loading Odyssey UI…
      </span>
      <div className="docs-splash__glow" />
      <svg
        className="docs-splash__mark"
        viewBox="0 0 820 300"
        role="img"
        aria-label="Odyssey UI"
      >
        <defs>
          <linearGradient id="docsSplashInk" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#ffffff" />
            <stop offset="0.62" stopColor="#EDE7FF" />
            <stop offset="1" stopColor="#B9A6FF" />
          </linearGradient>
        </defs>
        <g className="docs-splash__settle">
          <text
            x="410"
            y="212"
            textAnchor="middle"
            className="docs-splash__stroke"
          >
            YJSG
          </text>
          <text
            x="410"
            y="212"
            textAnchor="middle"
            className="docs-splash__fill"
            fill="url(#docsSplashInk)"
          >
            YJSG
          </text>
        </g>
        <g className="docs-splash__shard">
          <path
            d="M700 232 L706 200 L712 216 Z"
            fill="#ffffff"
            opacity="0.9"
          />
          <path
            d="M726.6 200.5 C726.9 199.2 727.7 198.3 728.7 198.3 H731.6 C732.8 198.3 733.6 199.4 733.4 200.6 L726.6 258 C726.5 259.2 725.7 259.9 724.6 259.8 L721.2 259.4 C720.2 259.3 719.5 258.4 719.6 257.4 Z"
            fill="#7257F6"
          />
        </g>
      </svg>
    </div>
  );
}
