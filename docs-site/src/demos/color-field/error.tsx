import { ColorField } from "@your-job-search-genius/odyssey-ui";

export default function ColorFieldError() {
  return (
    <div style={{ width: "16rem" }}>
      <ColorField label="Primary color" placeholder="Enter a color" errorMessage="Enter a valid color." />
    </div>
  );
}
