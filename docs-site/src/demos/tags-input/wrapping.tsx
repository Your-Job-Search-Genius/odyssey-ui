import { TagsInput } from "@your-job-search-genius/odyssey-ui";

export default function TagsInputWrapping() {
  return (
    <div style={{ width: "24rem" }}>
      <TagsInput
        label="Skills"
        defaultValue={[
          "React",
          "TypeScript",
          "CSS",
          "Accessibility",
          "Design Systems",
          "Storybook",
          "Testing",
        ]}
      />
    </div>
  );
}
