import { useMemo, useState } from "react";
import { NavLink } from "react-router-dom";
import { categories } from "../registry/categories";
import { registry } from "../registry/registry";

export function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  const [filter, setFilter] = useState("");
  const query = filter.trim().toLowerCase();

  const filtered = useMemo(() => {
    if (!query) return registry;
    return registry.filter(
      (c) =>
        c.name.toLowerCase().includes(query) ||
        c.slug.includes(query) ||
        c.keywords?.some((k) => k.toLowerCase().includes(query)),
    );
  }, [query]);

  const groups = categories
    .map((cat) => ({
      ...cat,
      items: filtered.filter((c) => c.category === cat.id),
    }))
    .filter((g) => g.items.length > 0);

  return (
    <nav aria-label="Components">
      <input
        type="search"
        className="docs-sidebar__filter"
        placeholder="Filter components…"
        aria-label="Filter components"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
      />
      {groups.length === 0 ? (
        <p className="docs-sidebar__empty">
          No components match “{filter.trim()}”.{" "}
          <button type="button" onClick={() => setFilter("")}>
            Clear
          </button>
        </p>
      ) : (
        groups.map((group) => (
          <div key={group.id} className="docs-sidebar__group">
            <h3 className="docs-sidebar__heading">{group.label}</h3>
            <ul className="docs-sidebar__list">
              {group.items.map((c) => (
                <li key={c.slug}>
                  <NavLink
                    to={`/components/${c.slug}`}
                    className="docs-sidebar__link"
                    onClick={onNavigate}
                  >
                    {c.name}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))
      )}
    </nav>
  );
}
