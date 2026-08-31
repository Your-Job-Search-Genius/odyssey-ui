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
        breakpoints.
      </p>

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
