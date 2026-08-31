import { Radio, RadioGroup } from "@your-job-search-genius/odyssey-ui";

export default function RadioOrientations() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      <RadioGroup label="Plan" defaultValue="monthly" orientation="horizontal">
        <Radio value="monthly">Monthly</Radio>
        <Radio value="annual">Annual</Radio>
      </RadioGroup>
      <RadioGroup
        label="Favorite sport"
        helperText="Used to personalize your news feed."
      >
        <Radio value="soccer">Soccer</Radio>
        <Radio value="baseball">Baseball</Radio>
        <Radio value="basketball">Basketball</Radio>
      </RadioGroup>
    </div>
  );
}
