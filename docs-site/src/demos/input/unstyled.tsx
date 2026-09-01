import { Input } from "@your-job-search-genius/odyssey-ui";

export default function InputUnstyled() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "0.625rem",
        width: "20rem",
        padding: "0.625rem 0.8125rem",
        borderRadius: "0.625rem",
        boxShadow: "inset 0 0 0 1px var(--wsu-color-field-border)",
      }}
    >
      <Input unstyled label="Search" placeholder="Search templates" style={{ flex: 1, minWidth: 0 }} />
    </div>
  );
}
