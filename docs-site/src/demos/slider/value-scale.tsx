import { Slider } from "@your-job-search-genius/odyssey-ui";

export default function SliderValueScale() {
  return (
    <div style={{ width: "16rem" }}>
      <Slider label="Volume" defaultValue={8} minValue={2} maxValue={20} step={3} />
    </div>
  );
}
