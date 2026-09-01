import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft01RoundIcon,
  ArrowRight01RoundIcon,
} from "@your-job-search-genius/icons";
import { Badge } from "@your-job-search-genius/odyssey-ui";
import { DemoBlock } from "../components/DemoBlock";
import { ImportSnippet } from "../components/ImportSnippet";
import { categoryLabel } from "../registry/categories";
import { bySlug, registry } from "../registry/registry";
import { audienceLabel, effectiveAudiences } from "../registry/audiences";
import { demoFileKeys } from "../demos/loader";
import { NotFound } from "./NotFound";

if (import.meta.env.DEV) {
  // Keep the registry and the demo files honest with each other.
  const referenced = new Set<string>();
  for (const c of registry) {
    for (const d of c.demos) {
      const key = `./${c.slug}/${d.id}.tsx`;
      referenced.add(key);
      if (!demoFileKeys.has(key)) {
        console.warn(`[registry] missing demo file: ${c.slug}/${d.id}`);
      }
    }
  }
  for (const key of demoFileKeys) {
    if (!referenced.has(key)) {
      console.warn(`[registry] demo file not referenced by registry: ${key}`);
    }
  }
  // Keep `audiences` tags meaningful: an empty array or a redundant explicit
  // "generic" both mean the same thing as omitting the field entirely.
  for (const c of registry) {
    if (c.audiences?.length === 0) {
      console.warn(
        `[registry] ${c.slug}: "audiences" is an empty array — omit the field to mean generic.`,
      );
    }
    if (c.audiences?.includes("generic")) {
      console.warn(
        `[registry] ${c.slug}: "generic" is redundant inside "audiences" — omit the field entirely instead.`,
      );
    }
  }
}

export function ComponentPage() {
  const { slug } = useParams<{ slug: string }>();
  const entry = slug ? bySlug.get(slug) : undefined;

  useEffect(() => {
    if (entry) document.title = `${entry.name} — Odyssey UI`;
    return () => {
      document.title = "Odyssey UI — React components";
    };
  }, [entry]);

  if (!entry) return <NotFound />;

  const index = registry.indexOf(entry);
  const prev = registry[index - 1];
  const next = registry[index + 1];
  const audienceTags = effectiveAudiences(entry).filter((a) => a !== "generic");

  return (
    <>
      <article className="docs-article">
        <span className="docs-eyebrow">{categoryLabel(entry.category)}</span>
        {audienceTags.length > 0 ? (
          <span className="docs-component-audience">
            {audienceTags.map((a) => (
              <Badge key={a} type="filled">
                {audienceLabel(a)}
              </Badge>
            ))}
          </span>
        ) : null}
        <h1>{entry.name}</h1>
        <p className="docs-lede">{entry.description}</p>

        <h2 id="import">
          <a className="docs-anchor" href="#import">
            Import
          </a>
        </h2>
        <ImportSnippet
          importNames={entry.importNames}
          subpath={entry.subpath}
          importPackage={entry.importPackage}
          skipTreeShake={entry.skipTreeShake}
        />

        {entry.demos.map((demo) => (
          <DemoBlock key={demo.id} slug={entry.slug} demo={demo} />
        ))}

        <nav className="docs-pagenav" aria-label="Component pages">
          {prev ? (
            <Link to={`/components/${prev.slug}`}>
              <span className="docs-pagenav__dir">
                <ArrowLeft01RoundIcon size={12} /> Previous
              </span>
              <span className="docs-pagenav__name">{prev.name}</span>
            </Link>
          ) : (
            <span />
          )}
          {next ? (
            <Link
              to={`/components/${next.slug}`}
              className="docs-pagenav--next"
            >
              <span className="docs-pagenav__dir">
                Next <ArrowRight01RoundIcon size={12} />
              </span>
              <span className="docs-pagenav__name">{next.name}</span>
            </Link>
          ) : null}
        </nav>
      </article>

      {entry.demos.length > 0 ? (
        <aside className="docs-rail">
          <div className="docs-rail__inner">
            <h2 className="docs-rail__title">On this page</h2>
            <ul className="docs-rail__list">
              <li>
                <a href="#import">Import</a>
              </li>
              {entry.demos.map((demo) => (
                <li key={demo.id}>
                  <a href={`#demo-${demo.id}`}>{demo.title}</a>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      ) : null}
    </>
  );
}
