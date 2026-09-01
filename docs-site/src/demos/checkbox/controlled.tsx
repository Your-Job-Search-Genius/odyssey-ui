import { useState } from "react";
import { Checkbox } from "@your-job-search-genius/odyssey-ui";

export default function CheckboxControlled() {
  const [checked, setChecked] = useState(false);
  return <Checkbox label={checked ? "Checked" : "Unchecked"} checked={checked} onChange={setChecked} />;
}
