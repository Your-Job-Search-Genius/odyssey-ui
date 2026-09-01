import { Radio, RadioGroup } from "@your-job-search-genius/odyssey-ui";

export default function RadioDisabled() {
  return (
    <RadioGroup label="Preferred contact method" defaultValue="email" disabled>
      <Radio value="email">Email</Radio>
      <Radio value="phone">Phone</Radio>
    </RadioGroup>
  );
}
