import { Radio, RadioGroup } from "@your-job-search-genius/odyssey-ui";

export default function RadioBasic() {
  return (
    <RadioGroup label="Preferred contact method" defaultValue="email">
      <Radio value="email">Email</Radio>
      <Radio value="phone">Phone</Radio>
      <Radio value="sms">SMS</Radio>
    </RadioGroup>
  );
}
