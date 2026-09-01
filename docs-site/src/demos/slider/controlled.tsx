import { useState } from "react";
import { Slider } from "@your-job-search-genius/odyssey-ui";

export default function SliderControlled() {
  const [currentValue, setCurrentValue] = useState(25);
  const [finalValue, setFinalValue] = useState(currentValue);

  return (
    <div style={{ width: "16rem" }}>
      <Slider
        label="Cookies to buy"
        value={currentValue}
        onChange={(v) => setCurrentValue(Array.isArray(v) ? (v[0] ?? currentValue) : v)}
        onChangeEnd={(v) => setFinalValue(Array.isArray(v) ? (v[0] ?? currentValue) : v)}
      />
      <p style={{ margin: "0.5rem 0 0", fontSize: "0.875rem" }}>
        onChange value: {currentValue}
      </p>
      <p style={{ margin: 0, fontSize: "0.875rem" }}>
        onChangeEnd value: {finalValue}
      </p>
    </div>
  );
}
