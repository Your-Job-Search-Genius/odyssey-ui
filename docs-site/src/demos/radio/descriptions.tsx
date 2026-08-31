import { Radio, RadioGroup } from "@your-job-search-genius/odyssey-ui";

export default function RadioDescriptions() {
  return (
    <RadioGroup label="Shipping method" defaultValue="standard">
      <Radio value="standard" description="Delivers in 5–7 business days">
        Standard Shipping (Free)
      </Radio>
      <Radio value="expedited" description="Delivers in 2–3 business days">
        Expedited Shipping ($9.99)
      </Radio>
      <Radio value="overnight" description="Next-day delivery">
        Overnight Shipping ($19.99)
      </Radio>
    </RadioGroup>
  );
}
