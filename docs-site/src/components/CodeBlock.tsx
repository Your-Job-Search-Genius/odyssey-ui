import { useEffect, useState } from "react";
import { getHighlighter, highlight } from "../lib/highlighter";

interface CodeBlockProps {
  code: string;
}

/**
 * Shiki-highlighted code. Renders a plain <pre> with identical content while
 * the (lazy, shared) highlighter chunk loads, so there is no layout shift.
 */
export function CodeBlock({ code }: CodeBlockProps) {
  const [html, setHtml] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    getHighlighter()
      .then((hl) => {
        if (!cancelled) setHtml(highlight(code, hl));
      })
      .catch(() => {
        // Highlighter failed to load — the plain fallback stays.
      });
    return () => {
      cancelled = true;
    };
  }, [code]);

  if (html) {
    return (
      <div
        className="docs-code"
        // Shiki output is generated locally from trusted demo source files.
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  }

  return (
    <div className="docs-code">
      <pre>
        <code>{code}</code>
      </pre>
    </div>
  );
}
