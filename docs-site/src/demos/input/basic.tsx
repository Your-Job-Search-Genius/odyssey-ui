import { Input } from "@your-job-search-genius/odyssey-ui";

export default function InputBasic() {
  return (
    <div style={{ width: "20rem" }}>
      <Input
        label="Email address"
        placeholder="you@example.com"
        helperText="We'll only use this to send your resume feedback."
      />
    </div>
  );
}
