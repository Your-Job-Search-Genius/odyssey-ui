import { useState } from "react";
import { Link } from "@your-job-search-genius/odyssey-ui";

export default function LinkPressHandler() {
  const [count, setCount] = useState(0);
  return (
    <div style={{ display: "grid", gap: "0.5rem" }}>
      <Link onPress={() => setCount((c) => c + 1)}>Press me</Link>
      <p style={{ margin: 0, font: "var(--wsu-font-body-sm)", color: "var(--wsu-color-text-body)" }}>
        Pressed {count} {count === 1 ? "time" : "times"}
      </p>
    </div>
  );
}
