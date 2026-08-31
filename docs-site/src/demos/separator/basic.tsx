import { Separator } from "@your-job-search-genius/odyssey-ui";

export default function SeparatorBasic() {
  return (
    <div style={{ width: "20rem" }}>
      <p style={{ margin: 0 }}>Section one content.</p>
      <Separator style={{ margin: "0.75rem 0" }} />
      <p style={{ margin: 0 }}>Section two content.</p>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.75rem",
          height: "2.5rem",
          marginTop: "1rem",
        }}
      >
        <span>Profile</span>
        <Separator orientation="vertical" />
        <span>Settings</span>
      </div>
    </div>
  );
}
