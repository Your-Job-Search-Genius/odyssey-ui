import {
  Badge,
  Button,
  Checkbox,
  Input,
  ThemeProvider,
  contrastRatio,
  createTheme,
  fontFamily,
  palette,
  radius,
  semanticColor,
  shadow,
  spacing,
  typography,
} from "@your-job-search-genius/odyssey-ui";
import { CodeBlock } from "../components/CodeBlock";
import { CopyButton } from "../components/CopyButton";

const PKG = "@your-job-search-genius/odyssey-ui";

function Snippet({ code, label }: { code: string; label?: string }) {
  return (
    <div className="docs-snippet">
      {label ? <span className="docs-snippet__label">{label}</span> : null}
      <CopyButton getText={() => code} />
      <CodeBlock code={code} />
    </div>
  );
}

const createThemeExample = `import { createTheme, ThemeProvider } from "${PKG}";

const oceanTheme = createTheme({
  colors: {
    "primary-bg": "#0B5FFF",
    "primary-bg-hover": "#0A50D9",
    "primary-text": "#FFFFFF",
    "border-focus": "#0B5FFF",
  },
});

function App() {
  return (
    <ThemeProvider theme={oceanTheme}>
      <YourApp />
    </ThemeProvider>
  );
}`;

const cssOverrideExample = `:root {
  --wsu-color-primary-bg: #0b5fff;
  --wsu-color-primary-bg-hover: #0a50d9;
  --wsu-color-border-focus: #0b5fff;
}`;

// Same override used by src/foundations/CustomTheme.stories.tsx's
// "Custom brand theme" story — kept in sync by eye since it's a docs
// example, not test-covered code.
const oceanTheme = createTheme({
  colors: {
    "primary-bg": "#0B5FFF",
    "primary-bg-hover": "#0A4FD1",
    "primary-bg-active": "#0842A8",
    "primary-bg-disabled": "#AFC9FF",
    "primary-text": "#FFFFFF",
    "border-focus": "#0B5FFF",
    "field-border-focus": "#0B5FFF",
    "focus-ring": "rgba(11,95,255,0.45)",
    "danger-bg": "#B3261E",
    "danger-bg-hover": "#8C1D17",
    "text-danger": "#8C1D17",
  },
});

function ThemeComparisonDemo() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, width: 220 }}>
      <Button>Primary action</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="primary" disabled>
        Disabled
      </Button>
      <Badge severity="fail" type="solid">
        Failing
      </Badge>
      <Checkbox label="Remember me" defaultChecked />
      <Input label="Email" placeholder="you@example.com" />
    </div>
  );
}

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

function ColorSwatch({ name, hex }: { name: string; hex: string }) {
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
      <div style={{ marginTop: 6, fontSize: "0.8125rem", fontWeight: 600, color: "#101419" }}>{name}</div>
      <div style={{ fontSize: "0.75rem", color: "#717680", fontFamily: "monospace" }}>{hex}</div>
      <div style={{ marginTop: 4 }}>{onWhite !== null ? ratioBadge(onWhite) : null}</div>
      <div style={{ fontSize: "0.6875rem", color: "#a4a7ae" }}>vs. white, as text</div>
    </div>
  );
}

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

export function Theming() {
  return (
    <article className="docs-article">
      <span className="docs-eyebrow">Docs</span>
      <h1>Theming</h1>
      <p className="docs-lede">
        Two ways to reskin the library — a typed <code>createTheme()</code>{" "}
        API and plain CSS custom properties — and you can mix them.
      </p>

      <h2 id="create-theme">
        1. <code>createTheme()</code> + <code>ThemeProvider</code>
      </h2>
      <Snippet code={createThemeExample} />
      <p>
        <code>createTheme(overrides)</code> starts from the shipped Odyssey
        theme and merges in whatever semantic color tokens you override — you
        only specify what's changing. In development, every text/background
        pairing the library depends on is re-audited for WCAG AA contrast and
        logged via <code>console.warn</code> on failure, including pairings
        your override introduces. The check is stripped in production builds.
      </p>
      <p>
        Nest a second <code>ThemeProvider</code> anywhere inside the tree to
        scope a different theme to just that subtree — it doesn't leak upward
        or affect siblings.
      </p>

      <h3>See it live</h3>
      <p>
        The default theme next to a custom &ldquo;Ocean&rdquo; brand theme
        built from the override above — same components, same markup,
        different <code>ThemeProvider</code>.
      </p>
      <div className="docs-demo">
        <div className="docs-demo__canvas docs-demo__canvas--block">
          <div style={{ display: "flex", gap: 48, flexWrap: "wrap" }}>
            <div>
              <div style={{ marginBottom: 12, fontSize: "0.8125rem", fontWeight: 650, color: "#101419" }}>
                Default theme
              </div>
              <ThemeProvider>
                <ThemeComparisonDemo />
              </ThemeProvider>
            </div>
            <div>
              <div style={{ marginBottom: 12, fontSize: "0.8125rem", fontWeight: 650, color: "#101419" }}>
                Custom &ldquo;Ocean&rdquo; brand theme
              </div>
              <ThemeProvider theme={oceanTheme}>
                <ThemeComparisonDemo />
              </ThemeProvider>
            </div>
          </div>
        </div>
      </div>

      <h2 id="css-vars">2. CSS custom property overrides</h2>
      <p>
        Every token is also a plain <code>--wsu-*</code> CSS custom property,
        so you can override them with plain CSS and skip the JS API entirely:
      </p>
      <Snippet label="your-theme.css" code={cssOverrideExample} />
      <p>
        The full token list ships in{" "}
        <code>{PKG}/styles.css</code> — colors (surface, text, border,
        primary, severity scales), spacing, radius, shadows, z-index, and
        breakpoints. The reference below is rendered live from the same
        token objects the library ships.
      </p>

      <h2 id="color-palette">3. Color palette</h2>
      <p>
        Every color is defined once, in the raw palette — an ordered set of
        numbered scales (<code>gray</code>, <code>primary</code>,{" "}
        <code>error</code>, <code>warning</code>, <code>success</code>,{" "}
        <code>blue</code>) plus a single <code>white</code>. Components never
        reference these hex values directly — they go through the semantic
        layer below. The badge under each swatch is that swatch&rsquo;s own
        contrast ratio if used as <em>text</em> on a white background (4.5:1
        AA threshold) — most primitives fail this, which is expected: most
        of them are meant as backgrounds or mid-tone accents, not text
        colors.
      </p>
      <div className="docs-demo">
        <div className="docs-demo__canvas docs-demo__canvas--block">
          {Object.entries(palette).map(([scaleName, scale]) =>
            typeof scale === "string" ? null : (
              <div key={scaleName} style={{ marginBottom: 28 }}>
                <h4
                  style={{
                    textTransform: "capitalize",
                    margin: "0 0 12px",
                    fontSize: "0.875rem",
                    color: "#101419",
                  }}
                >
                  {scaleName}
                </h4>
                <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                  {Object.entries(scale).map(([shade, hex]) => (
                    <ColorSwatch key={shade} name={shade} hex={hex as string} />
                  ))}
                </div>
              </div>
            ),
          )}
        </div>
      </div>

      <h2 id="semantic-colors">4. Semantic tokens &amp; contrast audit</h2>
      <p>
        Components reference these names, not raw hex — surfaced as{" "}
        <code>--wsu-color-*</code> custom properties. Every pairing below is
        computed live, using the same math <code>createTheme()</code> runs in
        development to warn on a bad custom theme — this isn&rsquo;t trusting
        a design tool&rsquo;s self-reported ratio.
      </p>
      <div className="docs-demo">
        <div className="docs-demo__canvas docs-demo__canvas--block">
          <table style={{ borderCollapse: "collapse", width: "100%" }}>
            <thead>
              <tr style={{ textAlign: "left", borderBottom: "1px solid #e9eaeb" }}>
                <th style={{ padding: "8px 12px", color: "#101419" }}>Pairing</th>
                <th style={{ padding: "8px 12px", color: "#101419" }}>Preview</th>
                <th style={{ padding: "8px 12px", color: "#101419" }}>Ratio</th>
              </tr>
            </thead>
            <tbody>
              {SEMANTIC_PAIRS.map((pair) => {
                const ratio = contrastRatio(pair.fg, pair.bg);
                return (
                  <tr key={pair.label} style={{ borderBottom: "1px solid #f6f6f6" }}>
                    <td style={{ padding: "8px 12px", fontSize: "0.8125rem", color: "#414651" }}>{pair.label}</td>
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
      </div>

      <h2 id="spacing">5. Spacing, radius &amp; shadows</h2>
      <p>
        The spacing scale, corner radii, and elevation shadows — each token
        below has a matching <code>--wsu-space-*</code>,{" "}
        <code>--wsu-radius-*</code>, or <code>--wsu-shadow-*</code> custom
        property.
      </p>
      <div className="docs-demo">
        <div className="docs-demo__canvas docs-demo__canvas--block">
          <h4 style={{ margin: "0 0 12px", fontSize: "0.875rem", color: "#101419" }}>Spacing scale</h4>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 32 }}>
            {Object.entries(spacing).map(([token, value]) => (
              <div key={token} style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <div style={{ width: 72, fontSize: "0.8125rem", fontFamily: "monospace", color: "#414651" }}>
                  space-{token}
                </div>
                <div style={{ height: 16, width: value, backgroundColor: "#6E5CF4", borderRadius: 4 }} />
                <div style={{ fontSize: "0.75rem", color: "#717680" }}>{value}</div>
              </div>
            ))}
          </div>

          <h4 style={{ margin: "0 0 12px", fontSize: "0.875rem", color: "#101419" }}>Border radius</h4>
          <div style={{ display: "flex", gap: 20, marginBottom: 32, flexWrap: "wrap" }}>
            {Object.entries(radius).map(([token, value]) => (
              <div key={token} style={{ textAlign: "center" }}>
                <div
                  style={{
                    width: 64,
                    height: 64,
                    backgroundColor: "#ECEAFF",
                    borderRadius: value,
                    border: "1px solid #DBD8FF",
                  }}
                />
                <div style={{ marginTop: 6, fontSize: "0.75rem", fontFamily: "monospace", color: "#414651" }}>
                  {token}: {value}
                </div>
              </div>
            ))}
          </div>

          <h4 style={{ margin: "0 0 12px", fontSize: "0.875rem", color: "#101419" }}>Shadows</h4>
          <div style={{ display: "flex", gap: 32, flexWrap: "wrap" }}>
            {Object.entries(shadow)
              .filter(([token]) => !token.toLowerCase().includes("focus"))
              .map(([token, value]) => (
                <div key={token} style={{ textAlign: "center" }}>
                  <div style={{ width: 96, height: 64, backgroundColor: "#fff", borderRadius: 8, boxShadow: value }} />
                  <div style={{ marginTop: 10, fontSize: "0.75rem", fontFamily: "monospace", color: "#414651" }}>
                    {token}
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      <h2 id="typography">6. Type scale</h2>
      <p>
        Typeface: <strong>Geist</strong>, with fallback stack{" "}
        <code style={{ fontSize: "0.75rem" }}>{fontFamily.base}</code>.
        Import <code>{PKG}/fonts.css</code> to load Geist for real, self-host
        it, or fall back to the system stack — the package doesn&rsquo;t
        force the network request on every consumer.
      </p>
      <div className="docs-demo">
        <div className="docs-demo__canvas docs-demo__canvas--block">
          {Object.entries(typography).map(([name, style]) => (
            <div key={name} style={{ marginBottom: 28, borderBottom: "1px solid #f6f6f6", paddingBottom: 20 }}>
              <div style={{ fontSize: "0.75rem", color: "#717680", marginBottom: 6, fontFamily: "monospace" }}>
                {name} — {style.fontWeight} · {style.fontSize} / {style.lineHeight} · tracking {style.letterSpacing}
              </div>
              <div
                style={{
                  fontFamily: style.fontFamily,
                  fontWeight: style.fontWeight,
                  fontSize: style.fontSize,
                  lineHeight: style.lineHeight,
                  letterSpacing: style.letterSpacing,
                  color: "#101419",
                }}
              >
                Reviewing your resume for keyword match
              </div>
            </div>
          ))}
        </div>
      </div>

      <h2 id="dark-mode">Dark mode</h2>
      <p>
        The library currently ships light-mode tokens only (the source design
        system has no dark mode yet). The token split is designed so a dark
        semantic mapping can be added without breaking changes — component
        CSS references semantic tokens, never raw palette values. This site's
        dark theme applies to the docs chrome only; component previews render
        on light surfaces.
      </p>
    </article>
  );
}
