import { Link } from "react-router-dom";
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

const usageExample = `import { Button, Input, ThemeProvider } from "${PKG}";

function App() {
  return (
    <ThemeProvider>
      <Input label="Email" type="email" placeholder="you@example.com" />
      <Button variant="primary">Continue</Button>
    </ThemeProvider>
  );
}`;

const treeShakenExample = `import { Button } from "${PKG}/components/Button";
import "${PKG}/components/Button/styles.css";`;

export function GettingStarted() {
  return (
    <article className="docs-article">
      <span className="docs-eyebrow">Docs</span>
      <h1>Getting started</h1>
      <p className="docs-lede">
        Install the package, import the stylesheet once, and every component
        is ready to use — accessibility, keyboard support, and theming
        included.
      </p>

      <h2 id="installation">Installation</h2>
      <Snippet label="Terminal" code={`npm install ${PKG} react react-dom`} />
      <p>
        <code>react</code> and <code>react-dom</code>{" "}
        (<code>^18.0.0 || ^19.0.0</code>) are peer dependencies — bring your
        own. <code>react-aria-components</code> is bundled as a regular
        dependency; you don't need to install it yourself.
      </p>

      <h2 id="styles">Import the stylesheet</h2>
      <p>
        Import the base stylesheet once, near the root of your app. It carries
        the design tokens as CSS custom properties, a small reset, and every
        component's styles:
      </p>
      <Snippet code={`import "${PKG}/styles.css";`} />
      <p>
        Optionally load the Geist typeface (the library falls back to the
        system font stack without it):
      </p>
      <Snippet code={`import "${PKG}/fonts.css";`} />

      <h2 id="usage">Use components</h2>
      <Snippet code={usageExample} />
      <p>
        <code>ThemeProvider</code> is optional if you're happy with the
        default theme — every component falls back to it automatically. Wrap
        your app in it when you want to{" "}
        <Link to="/theming">override colors</Link> or scope a second theme to
        part of the tree.
      </p>

      <h2 id="tree-shaking">Tree-shaking / per-component imports</h2>
      <p>
        Every component also has its own entry point with its own stylesheet,
        so a bundler can pull in only what's used:
      </p>
      <Snippet code={treeShakenExample} />
      <p>
        The package sets <code>"sideEffects": ["**/*.css"]</code>, so bundlers
        can safely drop unused component JS while keeping every CSS import you
        actually wrote.
      </p>

      <h2 id="next">Next steps</h2>
      <p>
        Browse the <Link to="/components">component gallery</Link> — every
        page has live previews and copyable code — or read about{" "}
        <Link to="/theming">theming</Link>.
      </p>
    </article>
  );
}
