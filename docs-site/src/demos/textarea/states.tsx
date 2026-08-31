import { Textarea } from "@your-job-search-genius/odyssey-ui";

export default function TextareaStates() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem", width: "24rem" }}>
      <Textarea label="Required" placeholder="Write a short bio" required />
      <Textarea
        label="Error"
        defaultValue=""
        errorMessage="Cover letter is required."
      />
      <Textarea label="Disabled" disabled defaultValue="Dear hiring manager," />
    </div>
  );
}
