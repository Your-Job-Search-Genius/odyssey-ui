import { Button } from "@your-job-search-genius/odyssey-ui";
import {
  Tick01Icon,
  ArrowRight01SharpIcon,
  MultiplicationSignIcon,
} from "@your-job-search-genius/icons";

export default function ButtonWithIcons() {
  return (
    <div style={{ display: "flex", gap: "0.75rem", alignItems: "center", flexWrap: "wrap" }}>
      <Button leadingIcon={<Tick01Icon />}>Mark complete</Button>
      <Button trailingIcon={<ArrowRight01SharpIcon />}>Continue</Button>
      <Button variant="secondary" leadingIcon={<MultiplicationSignIcon />} aria-label="Close" />
    </div>
  );
}
