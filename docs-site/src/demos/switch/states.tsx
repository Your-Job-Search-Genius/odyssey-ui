import { Switch } from "@your-job-search-genius/odyssey-ui";

export default function SwitchStates() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
      <Switch label="Off" />
      <Switch label="On" defaultChecked />
      <Switch label="Disabled" disabled />
      <Switch label="Disabled + on" disabled defaultChecked />
    </div>
  );
}
