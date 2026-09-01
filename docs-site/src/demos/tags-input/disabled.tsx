import { TagsInput } from "@your-job-search-genius/odyssey-ui";

export default function TagsInputDisabled() {
  return (
    <div style={{ width: "24rem" }}>
      <TagsInput label="Skills" defaultValue={["React", "CSS"]} disabled />
    </div>
  );
}
