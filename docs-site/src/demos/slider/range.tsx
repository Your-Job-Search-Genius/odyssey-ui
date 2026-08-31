import { Slider } from "@your-job-search-genius/odyssey-ui";

export default function SliderRange() {
  return (
    <div style={{ width: "16rem" }}>
      <Slider
        label="Range"
        defaultValue={[30, 60]}
        thumbLabels={["start", "end"]}
      />
    </div>
  );
}
