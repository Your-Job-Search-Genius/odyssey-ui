import { Link } from "react-router-dom";
import { categories, categoryLabel } from "../registry/categories";
import { registry } from "../registry/registry";

const featured = [
  "button",
  "input",
  "select",
  "modal",
  "table",
  "date-picker",
  "command-palette",
  "toast",
];

const componentCount = registry.filter((c) => c.category !== "hooks").length;
const hookCount = registry.length - componentCount;

export function Home() {
  return (
    <article className="docs-article" style={{ maxWidth: "none" }}>
      <section className="docs-hero">
        <span className="docs-eyebrow">
          {componentCount} components · {hookCount} hooks · WCAG 2.2 AA
        </span>
        <h1>
          Build accessible products with <em>Odyssey&nbsp;UI</em>
        </h1>
        <p>
          A production React component library built on react-aria-components,
          with accessibility, keyboard support, and theming built in — not
          bolted on. Browse every component live, then copy the code.
        </p>
        <div className="docs-hero__actions">
          <Link to="/getting-started" className="docs-btn docs-btn--primary">
            Get started
          </Link>
          <Link to="/components" className="docs-btn docs-btn--ghost">
            Browse components
          </Link>
        </div>
      </section>

      <h2>Popular components</h2>
      <div className="docs-card-grid">
        {featured.map((slug) => {
          const c = registry.find((r) => r.slug === slug);
          if (!c) return null;
          return (
            <Link
              key={c.slug}
              to={`/components/${c.slug}`}
              className="docs-card"
            >
              <span className="docs-card__title">{c.name}</span>
              <span className="docs-card__desc">{c.description}</span>
            </Link>
          );
        })}
      </div>

      <h2>Browse by category</h2>
      <div className="docs-card-grid">
        {categories.map((cat) => {
          const count = registry.filter((c) => c.category === cat.id).length;
          if (count === 0) return null;
          return (
            <Link
              key={cat.id}
              to={`/components#${cat.id}`}
              className="docs-card"
            >
              <span className="docs-card__title">{categoryLabel(cat.id)}</span>
              <span className="docs-card__desc">
                {count} component{count === 1 ? "" : "s"}
              </span>
            </Link>
          );
        })}
      </div>
    </article>
  );
}
