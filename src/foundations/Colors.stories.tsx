import type { Meta, StoryObj } from "@storybook/react";
import { palette } from "../theme/palette";
import { semanticColor } from "../theme/semantic";
import { contrastRatio } from "../theme/contrast";

const meta: Meta = {
  title: "Foundations/Colors",
  parameters: { layout: "padded" },
};

export default meta;
type Story = StoryObj;

function ratioBadge(ratio: number | null, kind: "text" | "non-text" = "text") {
  if (ratio === null) return null;
  const threshold = kind === "text" ? 4.5 : 3;
  const pass = ratio >= threshold;
  return (
    <span
      style={{
        display: "inline-block",
        padding: "0.125rem 0.375rem",
        borderRadius: "999px",
        fontSize: "0.6875rem",
        fontWeight: 700,
        color: pass ? "#05603A" : "#9E1020",
        backgroundColor: pass ? "#D1FADF" : "#FCD4D9",
      }}
    >
      {ratio.toFixed(2)}:1 {pass ? "AA pass" : "AA fail"}
    </span>
  );
}

function Swatch({ name, hex }: { name: string; hex: string }) {
  const onWhite = contrastRatio(hex, "#FFFFFF");
  return (
    <div style={{ width: 148 }}>
      <div
        style={{
          height: 64,
          borderRadius: 8,
          backgroundColor: hex,
          border: "1px solid rgba(0,0,0,0.08)",
        }}
      />
      <div style={{ marginTop: 6, fontSize: "0.8125rem", fontWeight: 600 }}>{name}</div>
      <div style={{ fontSize: "0.75rem", color: "#717680", fontFamily: "monospace" }}>{hex}</div>
      <div style={{ marginTop: 4 }}>{onWhite !== null ? ratioBadge(onWhite) : null}</div>
      <div style={{ fontSize: "0.6875rem", color: "#a4a7ae" }}>vs. white, as text</div>
    </div>
  );
}

export const Palette: Story = {
  name: "Raw palette",
  render: () => (
    <div>
      <p style={{ maxWidth: 640, color: "#535862" }}>
        Every color is defined here once, in <code>src/theme/palette.ts</code>. Components never
        reference these hex values directly — they go through the semantic layer below. The badge
        under each swatch is this swatch&rsquo;s own contrast ratio if used as <em>text</em> on a white
        background (4.5:1 AA threshold) — most primitives fail this, which is expected: most of
        them are meant as backgrounds or mid-tone accents, not text colors.
      </p>
      {Object.entries(palette).map(([scaleName, scale]) =>
        typeof scale === "string" ? null : (
          <div key={scaleName} style={{ marginBottom: 32 }}>
            <h3 style={{ textTransform: "capitalize", marginBottom: 12 }}>{scaleName}</h3>
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
              {Object.entries(scale).map(([shade, hex]) => (
                <Swatch key={shade} name={shade} hex={hex as string} />
              ))}
            </div>
          </div>
        ),
      )}
    </div>
  ),
};

const SEMANTIC_PAIRS: Array<{ label: string; fg: string; bg: string; kind: "text" | "non-text" }> = [
  { label: "text-heading on surface-default", fg: semanticColor["text-heading"], bg: semanticColor["surface-default"], kind: "text" },
  { label: "text-body on surface-default", fg: semanticColor["text-body"], bg: semanticColor["surface-default"], kind: "text" },
  { label: "text-subtle on surface-default", fg: semanticColor["text-subtle"], bg: semanticColor["surface-default"], kind: "text" },
  { label: "text-danger on surface-default", fg: semanticColor["text-danger"], bg: semanticColor["surface-default"], kind: "text" },
  { label: "text-success on surface-default", fg: semanticColor["text-success"], bg: semanticColor["surface-default"], kind: "text" },
  { label: "text-warning on surface-default", fg: semanticColor["text-warning"], bg: semanticColor["surface-default"], kind: "text" },
  { label: "primary-text on primary-bg", fg: semanticColor["primary-text"], bg: semanticColor["primary-bg"], kind: "text" },
  { label: "danger-text on danger-bg", fg: semanticColor["danger-text"], bg: semanticColor["danger-bg"], kind: "text" },
  { label: "secondary-text on secondary-bg", fg: semanticColor["secondary-text"], bg: semanticColor["secondary-bg"], kind: "text" },
  { label: "text-on-inverse on surface-inverse", fg: semanticColor["text-on-inverse"], bg: semanticColor["surface-inverse"], kind: "text" },
  { label: "severity-good-soft-text on severity-good-soft-bg", fg: semanticColor["severity-good-soft-text"], bg: semanticColor["severity-good-soft-bg"], kind: "text" },
  { label: "severity-fail-solid-text on severity-fail-solid-bg", fg: semanticColor["severity-fail-solid-text"], bg: semanticColor["severity-fail-solid-bg"], kind: "text" },
  { label: "border-focus on surface-default", fg: semanticColor["border-focus"], bg: semanticColor["surface-default"], kind: "non-text" },
];

export const Semantic: Story = {
  name: "Semantic tokens (with contrast audit)",
  render: () => (
    <div>
      <p style={{ maxWidth: 640, color: "#535862", marginBottom: 16 }}>
        Components reference these names, surfaced as <code>--wsu-color-*</code> CSS custom
        properties. Every pairing below is independently computed at build/story time (the same
        math <code>createTheme()</code> runs in dev mode to warn on a bad custom theme) — this is
        not trusting Figma&rsquo;s self-reported ratios. Several of these values were changed from the
        literal Figma value specifically because the original failed this check; see
        docs/design-inventory.md §1.3 for the full list.
      </p>
      <table style={{ borderCollapse: "collapse", width: "100%", maxWidth: 720 }}>
        <thead>
          <tr style={{ textAlign: "left", borderBottom: "1px solid #e9eaeb" }}>
            <th style={{ padding: "8px 12px" }}>Pairing</th>
            <th style={{ padding: "8px 12px" }}>Preview</th>
            <th style={{ padding: "8px 12px" }}>Ratio</th>
          </tr>
        </thead>
        <tbody>
          {SEMANTIC_PAIRS.map((pair) => {
            const ratio = contrastRatio(pair.fg, pair.bg);
            return (
              <tr key={pair.label} style={{ borderBottom: "1px solid #f6f6f6" }}>
                <td style={{ padding: "8px 12px", fontSize: "0.8125rem" }}>{pair.label}</td>
                <td style={{ padding: "8px 12px" }}>
                  <span
                    style={{
                      display: "inline-block",
                      padding: "4px 10px",
                      borderRadius: 6,
                      backgroundColor: pair.bg,
                      color: pair.fg,
                      fontSize: "0.8125rem",
                      fontWeight: 600,
                    }}
                  >
                    Ag
                  </span>
                </td>
                <td style={{ padding: "8px 12px" }}>{ratioBadge(ratio, pair.kind)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  ),
};
