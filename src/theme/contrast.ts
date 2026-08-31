/**
 * WCAG relative-luminance contrast math (no DOM access — safe to run at
 * module load in any environment, including SSR).
 */

function channelToLinear(channel: number): number {
  const c = channel / 255;
  return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
}

function hexToRgb(hex: string): [number, number, number] | null {
  const match = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex.trim());
  if (!match) return null;
  return [parseInt(match[1]!, 16), parseInt(match[2]!, 16), parseInt(match[3]!, 16)];
}

function relativeLuminance([r, g, b]: [number, number, number]): number {
  return 0.2126 * channelToLinear(r) + 0.7152 * channelToLinear(g) + 0.0722 * channelToLinear(b);
}

/**
 * Contrast ratio between two `#rrggbb` colors, per WCAG 2.x. Returns `null`
 * if either color isn't a resolvable 6-digit hex (e.g. an `rgba()` string,
 * which callers should resolve/flatten before checking).
 */
export function contrastRatio(hexA: string, hexB: string): number | null {
  const a = hexToRgb(hexA);
  const b = hexToRgb(hexB);
  if (!a || !b) return null;
  const lA = relativeLuminance(a);
  const lB = relativeLuminance(b);
  const lighter = Math.max(lA, lB);
  const darker = Math.min(lA, lB);
  return (lighter + 0.05) / (darker + 0.05);
}

export type ContrastKind = "text" | "large-text" | "non-text";

const THRESHOLDS: Record<ContrastKind, number> = {
  text: 4.5,
  "large-text": 3,
  "non-text": 3,
};

export interface ContrastCheck {
  /** Human-readable label for the pairing, shown in the dev warning. */
  label: string;
  foreground: string;
  background: string;
  kind: ContrastKind;
}

export interface ContrastResult extends ContrastCheck {
  ratio: number | null;
  passes: boolean;
}

export function checkContrast(check: ContrastCheck): ContrastResult {
  const ratio = contrastRatio(check.foreground, check.background);
  return {
    ...check,
    ratio,
    passes: ratio === null ? true : ratio >= THRESHOLDS[check.kind],
  };
}

/**
 * Dev-mode-only contrast audit. Runs a set of foreground/background pairs
 * through `checkContrast` and `console.warn`s for every failure. Callers
 * are responsible for gating this on `process.env.NODE_ENV !== "production"`
 * (ThemeProvider does this for the built-in checks; call it yourself for a
 * custom theme).
 */
export function warnOnContrastFailures(checks: ContrastCheck[]): ContrastResult[] {
  const results = checks.map(checkContrast);
  for (const result of results) {
    if (!result.passes) {
      const required = THRESHOLDS[result.kind];
      // eslint-disable-next-line no-console
      console.warn(
        `[@writesea/odyssey-ui] Contrast warning: "${result.label}" is ${
          result.ratio?.toFixed(2) ?? "unresolvable"
        }:1 (${result.foreground} on ${result.background}), below the ${required}:1 required for ${result.kind}.`,
      );
    }
  }
  return results;
}
