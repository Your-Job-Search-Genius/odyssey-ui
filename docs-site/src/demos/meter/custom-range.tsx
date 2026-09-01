import { Meter } from "@your-job-search-genius/odyssey-ui";

export default function MeterCustomRange() {
  return (
    <Meter
      label="Storage used"
      value={3.5}
      minValue={0}
      maxValue={5}
      style={{ width: "16rem" }}
    />
  );
}
