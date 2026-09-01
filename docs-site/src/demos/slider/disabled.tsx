import { Slider } from "@your-job-search-genius/odyssey-ui";

export default function SliderDisabled() {
  return (
    <div style={{ width: "16rem" }}>
      <Slider label="Cookies to buy" defaultValue={25} disabled />
    </div>
  );
}
