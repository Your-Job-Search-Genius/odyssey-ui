import { useState } from "react";
import { Input } from "@your-job-search-genius/odyssey-ui";

export default function InputControlled() {
  const [value, setValue] = useState("");
  return (
    <div style={{ width: "20rem" }}>
      <Input label="Controlled value" value={value} onChange={setValue} />
    </div>
  );
}
