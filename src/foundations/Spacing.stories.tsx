import type { Meta, StoryObj } from "@storybook/react";
import { spacing } from "../theme/spacing";
import { radius } from "../theme/radius";
import { shadow } from "../theme/shadow";

const meta: Meta = {
  title: "Foundations/Spacing & Elevation",
  parameters: { layout: "padded" },
};

export default meta;
type Story = StoryObj;

export const Spacing: Story = {
  render: () => (
    <div>
      <h3 style={{ marginBottom: 12 }}>Spacing scale</h3>
      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 32 }}>
        {Object.entries(spacing).map(([token, value]) => (
          <div key={token} style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ width: 72, fontSize: "0.8125rem", fontFamily: "monospace" }}>space-{token}</div>
            <div style={{ height: 16, width: value, backgroundColor: "#6E5CF4", borderRadius: 4 }} />
            <div style={{ fontSize: "0.75rem", color: "#717680" }}>{value}</div>
          </div>
        ))}
      </div>

      <h3 style={{ marginBottom: 12 }}>Border radius</h3>
      <div style={{ display: "flex", gap: 20, marginBottom: 32, flexWrap: "wrap" }}>
        {Object.entries(radius).map(([token, value]) => (
          <div key={token} style={{ textAlign: "center" }}>
            <div style={{ width: 64, height: 64, backgroundColor: "#ECEAFF", borderRadius: value, border: "1px solid #DBD8FF" }} />
            <div style={{ marginTop: 6, fontSize: "0.75rem", fontFamily: "monospace" }}>
              {token}: {value}
            </div>
          </div>
        ))}
      </div>

      <h3 style={{ marginBottom: 12 }}>Shadows</h3>
      <div style={{ display: "flex", gap: 32, flexWrap: "wrap" }}>
        {Object.entries(shadow)
          .filter(([token]) => !token.toLowerCase().includes("focus"))
          .map(([token, value]) => (
            <div key={token} style={{ textAlign: "center" }}>
              <div style={{ width: 96, height: 64, backgroundColor: "#fff", borderRadius: 8, boxShadow: value }} />
              <div style={{ marginTop: 10, fontSize: "0.75rem", fontFamily: "monospace" }}>{token}</div>
            </div>
          ))}
      </div>
    </div>
  ),
};
