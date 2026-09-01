import { Radio, RadioGroup } from "@your-job-search-genius/odyssey-ui";

export default function RadioError() {
  return (
    <RadioGroup label="Favorite sport" required errorMessage="Choose a sport to continue.">
      <Radio value="soccer">Soccer</Radio>
      <Radio value="baseball">Baseball</Radio>
      <Radio value="basketball">Basketball</Radio>
    </RadioGroup>
  );
}
