import { Checkbox, CheckboxGroup } from "@your-job-search-genius/odyssey-ui";

export default function CheckboxGroupDisabled() {
  return (
    <CheckboxGroup label="Notification preferences" defaultValue={["product"]} disabled>
      <Checkbox value="product" label="Product Updates" />
      <Checkbox value="security" label="Security Alerts" />
    </CheckboxGroup>
  );
}
