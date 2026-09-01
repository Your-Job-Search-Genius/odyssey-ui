import type { CSSProperties } from "react";
import { Link } from "react-router-dom";
import {
  AccessIcon,
  PaintBoardIcon,
  SourceCodeIcon,
} from "@your-job-search-genius/icons";
import { categories, categoryLabel } from "../registry/categories";
import { registry } from "../registry/registry";
import { CountUp } from "../components/CountUp";

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
const categoryCount = categories.filter((cat) =>
  registry.some((c) => c.category === cat.id),
).length;

const features = [
  {
    Icon: AccessIcon,
    title: "Accessible by default",
    desc: "Built on react-aria-components with full keyboard support, focus management, and WCAG 2.2 AA behavior baked in — not bolted on.",
  },
  {
    Icon: PaintBoardIcon,
    title: "Themeable tokens",
    desc: "Every color, space, and radius is a CSS custom property. Restyle the entire system by overriding a handful of --wsu-* tokens.",
  },
  {
    Icon: SourceCodeIcon,
    title: "Copy-paste ready",
    desc: "Browse every variant live, flip to the Code tab, and copy real, working source straight into your app.",
  },
];

/** Inline stagger index consumed by the `[data-reveal]` rules in site.css. */
const reveal = (i: number): CSSProperties => ({ "--reveal-i": i }) as CSSProperties;

export function Home() {
  return (
    <article className="docs-article docs-home" style={{ maxWidth: "none" }}>
      <section className="docs-hero">
        <div className="docs-hero__bg" aria-hidden="true">
          <span className="docs-hero__grid" />
          <span className="docs-hero__blob docs-hero__blob--1" />
          <span className="docs-hero__blob docs-hero__blob--2" />
          <span className="docs-hero__blob docs-hero__blob--3" />
        </div>

        <div className="docs-hero__content">
          <span className="docs-eyebrow" data-reveal style={reveal(0)}>
            {componentCount} components · {hookCount} hooks · WCAG 2.2 AA
          </span>
          <h1 data-reveal style={reveal(1)}>
            Build accessible products with <em>Odyssey&nbsp;UI</em>
          </h1>
          <p data-reveal style={reveal(2)}>
            A production React component library built on react-aria-components,
            with accessibility, keyboard support, and theming built in — not
            bolted on. Browse every component live, then copy the code.
          </p>
          <div className="docs-hero__actions" data-reveal style={reveal(3)}>
            <Link to="/getting-started" className="docs-btn docs-btn--primary">
              Get started
            </Link>
            <Link to="/components" className="docs-btn docs-btn--ghost">
              Browse components
            </Link>
          </div>

          <dl className="docs-hero__stats" data-reveal style={reveal(4)}>
            <div className="docs-stat">
              <dt className="docs-stat__label">Components</dt>
              <dd className="docs-stat__num">
                <CountUp to={componentCount} />
              </dd>
            </div>
            <div className="docs-stat">
              <dt className="docs-stat__label">Hooks</dt>
              <dd className="docs-stat__num">
                <CountUp to={hookCount} />
              </dd>
            </div>
            <div className="docs-stat">
              <dt className="docs-stat__label">Categories</dt>
              <dd className="docs-stat__num">
                <CountUp to={categoryCount} />
              </dd>
            </div>
            <div className="docs-stat">
              <dt className="docs-stat__label">WCAG 2.2</dt>
              <dd className="docs-stat__num docs-stat__num--text">AA</dd>
            </div>
          </dl>
        </div>
      </section>

      <section className="docs-features" aria-label="Highlights">
        {features.map((f, i) => (
          <div
            className="docs-feature"
            key={f.title}
            data-reveal
            style={reveal(i)}
          >
            <span className="docs-feature__icon" aria-hidden="true">
              <f.Icon size={22} />
            </span>
            <h2 className="docs-feature__title">{f.title}</h2>
            <p className="docs-feature__desc">{f.desc}</p>
          </div>
        ))}
      </section>

      <h2 data-reveal>Popular components</h2>
      <div className="docs-card-grid">
        {featured.map((slug, i) => {
          const c = registry.find((r) => r.slug === slug);
          if (!c) return null;
          return (
            <Link
              key={c.slug}
              to={`/components/${c.slug}`}
              className="docs-card"
              data-reveal
              style={reveal(i)}
            >
              <span className="docs-card__title">{c.name}</span>
              <span className="docs-card__desc">{c.description}</span>
            </Link>
          );
        })}
      </div>

      <h2 data-reveal>Browse by category</h2>
      <div className="docs-card-grid">
        {categories.map((cat, i) => {
          const count = registry.filter((c) => c.category === cat.id).length;
          if (count === 0) return null;
          return (
            <Link
              key={cat.id}
              to={`/components#${cat.id}`}
              className="docs-card"
              data-reveal
              style={reveal(i)}
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
