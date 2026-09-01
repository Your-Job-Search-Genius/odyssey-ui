import { Checkbox, CheckboxGroup } from "@your-job-search-genius/odyssey-ui";

export default function CheckboxGroupHorizontal() {
  return (
    <CheckboxGroup label="Notification preferences" defaultValue={["product"]} orientation="horizontal">
      <Checkbox value="product" label="Product Updates" />
      <Checkbox value="security" label="Security Alerts" />
    </CheckboxGroup>
  );
}
