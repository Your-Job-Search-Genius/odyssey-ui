import { CodeBlock } from "./CodeBlock";
import { CopyButton } from "./CopyButton";

const PKG = "@your-job-search-genius/odyssey-ui";

interface ImportSnippetProps {
  importNames: string[];
  subpath: string;
  /** Defaults to the Odyssey UI package. Hooks pass `"react-aria"`. */
  importPackage?: string;
  /** Hooks and other non-component imports skip the CSS subpath pair. */
  skipTreeShake?: boolean;
}

function Snippet({ label, code }: { label: string; code: string }) {
  return (
    <div className="docs-snippet">
      <span className="docs-snippet__label">{label}</span>
      <CopyButton getText={() => code} label={`Copy ${label}`} />
      <CodeBlock code={code} />
    </div>
  );
}

export function ImportSnippet({
  importNames,
  subpath,
  importPackage = PKG,
  skipTreeShake = false,
}: ImportSnippetProps) {
  const names = importNames.join(", ");
  const rootImport = `import { ${names} } from "${importPackage}";`;

  if (skipTreeShake || importPackage !== PKG) {
    return (
      <>
        <Snippet label="Import" code={rootImport} />
        {importPackage !== PKG ? (
          <p style={{ fontSize: "0.85rem", color: "var(--docs-subtle)" }}>
            These hooks come from <code>react-aria</code> — the same primitives
            Odyssey UI components wrap. They ship with{" "}
            <code>react-aria-components</code>; you do not need a separate
            install when you already depend on Odyssey UI.
          </p>
        ) : null}
      </>
    );
  }

  const subpathImport = [
    `import { ${names} } from "${PKG}/components/${subpath}";`,
    `import "${PKG}/components/${subpath}/styles.css";`,
  ].join("\n");

  return (
    <>
      <Snippet label="Import" code={rootImport} />
      <Snippet label="Tree-shaken import" code={subpathImport} />
      <p style={{ fontSize: "0.85rem", color: "var(--docs-subtle)" }}>
        With the root import, styles come from the single{" "}
        <code>{PKG}/styles.css</code> stylesheet. The tree-shaken form bundles
        only this component and its own CSS.
      </p>
    </>
  );
}
