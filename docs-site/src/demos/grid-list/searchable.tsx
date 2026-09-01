import { GridList } from "@your-job-search-genius/odyssey-ui";

function avatar(initials: string) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--wsu-color-secondary-bg)",
        color: "var(--wsu-color-text-heading)",
        font: "var(--wsu-font-body-sm-semibold)",
      }}
    >
      {initials}
    </div>
  );
}

const items = [
  { id: "ada", title: "Ada Lovelace", description: "Mathematician", image: avatar("AL") },
  { id: "grace", title: "Grace Hopper", description: "Computer scientist", image: avatar("GH") },
  { id: "margaret", title: "Margaret Hamilton", description: "Software engineer", image: avatar("MH") },
  { id: "katherine", title: "Katherine Johnson", description: "Physicist", image: avatar("KJ") },
];

export default function GridListSearchable() {
  return (
    <GridList
      aria-label="People"
      items={items}
      searchable
      searchLabel="Search people"
    />
  );
}
