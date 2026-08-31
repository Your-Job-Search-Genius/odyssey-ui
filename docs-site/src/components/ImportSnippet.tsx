import { CodeBlock } from "./CodeBlock";
import { CopyButton } from "./CopyButton";

const PKG = "@your-job-search-genius/odyssey-ui";

interface ImportSnippetProps {
  importNames: string[];
  subpath: string;
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

export function ImportSnippet({ importNames, subpath }: ImportSnippetProps) {
  const names = importNames.join(", ");
  const rootImport = `import { ${names} } from "${PKG}";`;
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
