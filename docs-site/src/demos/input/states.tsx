import { Input } from "@your-job-search-genius/odyssey-ui";

export default function InputStates() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem", width: "20rem" }}>
      <Input label="Required" placeholder="you@example.com" isRequired />
      <Input label="Disabled" defaultValue="you@example.com" isDisabled />
      <Input label="Read-only" defaultValue="you@example.com" isReadOnly />
      <Input
        label="Invalid"
        defaultValue="not-an-email"
        errorMessage="Enter a valid email address"
      />
    </div>
  );
}
