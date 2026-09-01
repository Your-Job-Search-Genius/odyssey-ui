import { audiences } from "../registry/audiences";
import { useAudienceFilter } from "../lib/audienceFilter";

/** Generic / Client / Admin tab bar — filters the sidebar and catalog by team. */
export function AudienceTabs() {
  const [audience, setAudience] = useAudienceFilter();

  return (
    <div
      className="docs-audience-tabs"
      role="tablist"
      aria-label="Filter components by team"
    >
      {audiences.map((a) => (
        <button
          key={a.id}
          type="button"
          role="tab"
          className="docs-audience-tabs__tab"
          aria-selected={audience === a.id}
          onClick={() => setAudience(a.id)}
        >
          {a.label}
        </button>
      ))}
    </div>
  );
}
