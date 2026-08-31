import { Suspense, useEffect, useState } from "react";
import type { DemoEntry } from "../registry/types";
import { getDemoComponent, getDemoSource } from "../demos/loader";
import { CodeBlock } from "./CodeBlock";
import { CopyButton } from "./CopyButton";
import { DemoErrorBoundary } from "./DemoErrorBoundary";
import { PreviewCanvas } from "./PreviewCanvas";

interface DemoBlockProps {
  slug: string;
  demo: DemoEntry;
}

type SourceState =
  | { status: "loading" }
  | { status: "ready"; text: string }
  | { status: "error" };

export function DemoBlock({ slug, demo }: DemoBlockProps) {
  const [tab, setTab] = useState<"preview" | "code">("preview");
  const [source, setSource] = useState<SourceState>({ status: "loading" });

  const Demo = getDemoComponent(slug, demo.id);

  useEffect(() => {
    let cancelled = false;
    getDemoSource(slug, demo.id)
      .then((text) => {
        if (!cancelled) setSource({ status: "ready", text });
      })
      .catch(() => {
        if (!cancelled) setSource({ status: "error" });
      });
    return () => {
      cancelled = true;
    };
  }, [slug, demo.id]);

  const headingId = `demo-${demo.id}`;

  return (
    <section aria-labelledby={headingId}>
      <h2 id={headingId}>
        <a className="docs-anchor" href={`#${headingId}`}>
          {demo.title}
        </a>
      </h2>
      {demo.description ? <p>{demo.description}</p> : null}
      <div className="docs-demo">
        <div
          className="docs-demo__bar"
          role="tablist"
          aria-label={`${demo.title} view`}
        >
          <button
            type="button"
            role="tab"
            className="docs-demo__tab"
            aria-selected={tab === "preview"}
            onClick={() => setTab("preview")}
          >
            Preview
          </button>
          <button
            type="button"
            role="tab"
            className="docs-demo__tab"
            aria-selected={tab === "code"}
            onClick={() => setTab("code")}
          >
            Code
          </button>
          <span className="docs-demo__bar-spacer" />
          <CopyButton getText={() => getDemoSource(slug, demo.id)} />
        </div>

        {tab === "preview" ? (
          Demo ? (
            <DemoErrorBoundary>
              <Suspense
                fallback={
                  <div className="docs-demo__canvas">
                    <div className="docs-demo__skeleton" />
                  </div>
                }
              >
                <PreviewCanvas wide={demo.wide}>
                  <Demo />
                </PreviewCanvas>
              </Suspense>
            </DemoErrorBoundary>
          ) : (
            <div className="docs-demo__error" role="alert">
              <strong>Demo not found.</strong>
              The registry references {slug}/{demo.id}, but no demo file
              exists for it.
            </div>
          )
        ) : source.status === "ready" ? (
          <CodeBlock code={source.text} />
        ) : source.status === "loading" ? (
          <div className="docs-demo__canvas">
            <div className="docs-demo__skeleton" />
          </div>
        ) : (
          <div className="docs-demo__error" role="alert">
            <strong>Couldn't load source.</strong>
            The code for this demo failed to load.
          </div>
        )}
      </div>
    </section>
  );
}
