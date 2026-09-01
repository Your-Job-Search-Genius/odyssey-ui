import { useState } from "react";
import { Switch } from "@your-job-search-genius/odyssey-ui";

export default function SwitchControlled() {
  const [checked, setChecked] = useState(false);
  return <Switch label={checked ? "On" : "Off"} checked={checked} onChange={setChecked} />;
}
