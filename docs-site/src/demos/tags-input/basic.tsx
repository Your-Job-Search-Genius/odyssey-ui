import { TagsInput } from "@your-job-search-genius/odyssey-ui";

export default function TagsInputBasic() {
  return (
    <div style={{ width: "24rem" }}>
      <TagsInput
        label="Skills"
        defaultValue={["React", "TypeScript", "CSS"]}
        helperText="Press Enter to add a tag. Backspace removes the last one."
      />
    </div>
  );
}
