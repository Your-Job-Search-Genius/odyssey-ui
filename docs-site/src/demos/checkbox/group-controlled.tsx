import { useState } from "react";
import { Checkbox, CheckboxGroup } from "@your-job-search-genius/odyssey-ui";

export default function CheckboxGroupControlled() {
  const [value, setValue] = useState<string[]>(["product"]);
  return (
    <CheckboxGroup
      label={`Notification preferences (${value.join(", ") || "none"})`}
      value={value}
      onChange={setValue}
    >
      <Checkbox value="product" label="Product Updates" />
      <Checkbox value="security" label="Security Alerts" />
      <Checkbox value="marketing" label="Marketing Emails" />
    </CheckboxGroup>
  );
}
