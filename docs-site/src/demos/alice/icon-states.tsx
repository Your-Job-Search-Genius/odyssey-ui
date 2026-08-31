import { AliceIcon } from "@your-job-search-genius/odyssey-ui";

export default function AliceIconStates() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "1.75rem" }}>
      {(["idle", "action", "loading"] as const).map((state) => (
        <div key={state} style={{ display: "grid", justifyItems: "center", gap: "0.5rem" }}>
          <AliceIcon state={state} />
          <code style={{ font: "var(--wsu-font-body-sm)", color: "var(--wsu-color-text-body)" }}>
            {state}
          </code>
        </div>
      ))}
    </div>
  );
}
