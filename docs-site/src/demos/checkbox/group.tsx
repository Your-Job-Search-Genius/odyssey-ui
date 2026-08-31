import { Checkbox, CheckboxGroup } from "@your-job-search-genius/odyssey-ui";

export default function CheckboxGroupDemo() {
  return (
    <CheckboxGroup label="Email notification preferences" defaultValue={["product"]}>
      <Checkbox
        value="product"
        label="Product Updates"
        description="Get notified about new features and improvements"
      />
      <Checkbox
        value="security"
        label="Security Alerts"
        description="Important notifications about your account safety"
      />
      <Checkbox
        value="marketing"
        label="Marketing Emails"
        description="Receive promotions, offers, and newsletters"
      />
    </CheckboxGroup>
  );
}
