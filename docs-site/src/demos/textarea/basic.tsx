import { Textarea } from "@your-job-search-genius/odyssey-ui";

export default function TextareaBasic() {
  return (
    <div style={{ width: "24rem" }}>
      <Textarea
        label="Cover letter"
        placeholder="Tell us why you're a great fit..."
        helperText="Keep it under 500 words."
      />
    </div>
  );
}
