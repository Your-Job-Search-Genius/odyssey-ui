import { useState } from "react";
import { Radio, RadioGroup } from "@your-job-search-genius/odyssey-ui";

export default function RadioControlled() {
  const [value, setValue] = useState<string | null>(null);
  return (
    <>
      <RadioGroup label="Favorite sport" value={value} onChange={setValue}>
        <Radio value="soccer">Soccer</Radio>
        <Radio value="baseball">Baseball</Radio>
        <Radio value="basketball">Basketball</Radio>
      </RadioGroup>
      <p style={{ marginTop: 8 }}>Current selection: {value || "None"}</p>
    </>
  );
}
