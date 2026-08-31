import { ListBox } from "@your-job-search-genius/odyssey-ui";

const skills = [
  { id: "react", label: "React", description: "Component-based UI library" },
  { id: "graphql", label: "GraphQL", description: "Query language for APIs" },
  { id: "docker", label: "Docker", description: "Container runtime and image format" },
];

export default function ListBoxDescriptions() {
  return (
    <ListBox
      aria-label="Skills"
      items={skills}
      selectionMode="multiple"
    />
  );
}
