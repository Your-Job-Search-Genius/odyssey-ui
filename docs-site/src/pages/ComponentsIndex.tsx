import { Link } from "react-router-dom";
import { categories } from "../registry/categories";
import { registry } from "../registry/registry";
import { audiences, matchesAudience } from "../registry/audiences";
import { useAudienceFilter } from "../lib/audienceFilter";
import { AudienceTabs } from "../components/AudienceTabs";

export function ComponentsIndex() {
  const [audience] = useAudienceFilter();
  const audienceScoped = registry.filter((c) => matchesAudience(c, audience));
  const activeAudience = audiences.find((a) => a.id === audience);

  return (
    <article className="docs-article" style={{ maxWidth: "none" }}>
      <span className="docs-eyebrow">Library</span>
      <h1>Components</h1>
      <p className="docs-lede">
        {registry.length} accessible React components, organized by what they
        do. Every page includes live previews, import instructions, and
        copyable source code.
      </p>
      <AudienceTabs />
      {audienceScoped.length === 0 ? (
        <div className="docs-empty-state">
          <h2>No {activeAudience?.label ?? audience} components yet</h2>
          <p>{activeAudience?.description}</p>
          <Link to="/components">Browse Generic components</Link>
        </div>
      ) : (
        categories.map((cat) => {
          const items = audienceScoped.filter((c) => c.category === cat.id);
          if (items.length === 0) return null;
          return (
            <section key={cat.id}>
              <h2 id={cat.id}>{cat.label}</h2>
              <div className="docs-card-grid">
                {items.map((c) => (
                  <Link
                    key={c.slug}
                    to={`/components/${c.slug}`}
                    className="docs-card"
                  >
                    <span className="docs-card__title">{c.name}</span>
                    <span className="docs-card__desc">{c.description}</span>
                  </Link>
                ))}
              </div>
            </section>
          );
        })
      )}
    </article>
  );
}
