import { TagsInput } from "@your-job-search-genius/odyssey-ui";

export default function TagsInputInvalid() {
  return (
    <div style={{ width: "24rem" }}>
      <TagsInput
        label="Skills"
        defaultValue={["React"]}
        errorMessage="Add at least three skills"
      />
    </div>
  );
}
