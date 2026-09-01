import { Radio, RadioGroup } from "@your-job-search-genius/odyssey-ui";

export default function RadioDisabledOption() {
  return (
    <RadioGroup label="Shipping method" defaultValue="standard">
      <Radio value="standard" description="Delivers in 5–7 business days">
        Standard Shipping (Free)
      </Radio>
      <Radio value="overnight" description="Currently unavailable in your area" disabled>
        Overnight Shipping ($19.99)
      </Radio>
    </RadioGroup>
  );
}
