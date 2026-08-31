import type { Meta, StoryObj } from "@storybook/react";
import { Badge } from "./Badge";
import { CheckGlyph } from "../Icon/glyphs";

const SEVERITIES = ["excellent", "good", "fair", "poor", "bad", "fail"] as const;

const meta: Meta<typeof Badge> = {
  title: "Figma Components/Primitives/Badge",
  component: Badge,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Static `<span>` — non-interactive, so no behavior library is needed. **Use when:** labeling a status or grade (e.g. resume-score severity) at a glance. **Don't use when:** the chip is itself clickable or removable (that's a separate interactive pattern this library doesn't ship yet). Severity is always paired with visible text, never conveyed by color alone (WCAG 1.4.1). `poor`/`bad` colors are approximated — Figma never resolved a Brown/Orange palette for them (see docs/design-inventory.md §1.2).",
      },
    },
  },
  argTypes: {
    type: { control: "select", options: ["solid", "soft", "border"] },
    severity: { control: "select", options: SEVERITIES },
  },
  args: { children: "Excellent", type: "soft", severity: "excellent" },
};

export default meta;
type Story = StoryObj<typeof Badge>;

export const Playground: Story = {};

export const Severities: Story = {
  render: (args) => (
    <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
      {SEVERITIES.map((severity) => (
        <Badge key={severity} {...args} severity={severity}>
          {severity}
        </Badge>
      ))}
    </div>
  ),
};

export const Types: Story = {
  render: (args) => (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
      {(["solid", "soft", "border"] as const).map((type) => (
        <div key={type} style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
          {SEVERITIES.map((severity) => (
            <Badge key={severity} {...args} type={type} severity={severity}>
              {severity}
            </Badge>
          ))}
        </div>
      ))}
    </div>
  ),
};

export const WithIcon: Story = {
  render: (args) => (
    <Badge {...args} icon={<CheckGlyph />}>
      Excellent
    </Badge>
  ),
};

/**
 * The complete Figma matrix from node 433:4936 — every Type x Color x Icon
 * the file defines. Solid/Soft are the 28px grading pills; Filled/Border/
 * Tabs are the 32px neutral chips where the colour only tints the count.
 */
export const FigmaMatrix: Story = {
  name: "Figma matrix (all types x colors x icons)",
  render: () => {
    const colors = [
      ["excellent", "Green-Excellent"],
      ["good", "Blue-Good"],
      ["fair", "Yellow-Fair"],
      ["poor", "Brown-Poor"],
      ["bad", "Orange-Bad"],
      ["fail", "Red-Fail"],
    ] as const;
    const th = {
      font: "var(--wsu-font-body-sm)",
      color: "var(--wsu-color-text-body)",
      textAlign: "left",
      padding: "0 1.25rem 0.5rem 0",
      whiteSpace: "nowrap",
    } as const;
    const td = { padding: "0 1.25rem 0.75rem 0", verticalAlign: "middle" } as const;
    const h3 = {
      font: "var(--wsu-font-heading-sm)",
      color: "var(--wsu-color-text-heading)",
      margin: "0 0 1rem",
    } as const;

    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "2.5rem" }}>
        <section>
          <h3 style={h3}>Grading pills — Solid / Soft (28px)</h3>
          <table style={{ borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={th}>Color</th>
                <th style={th}>Solid</th>
                <th style={th}>Soft</th>
              </tr>
            </thead>
            <tbody>
              {colors.map(([severity, figmaName]) => (
                <tr key={severity}>
                  <td style={{ ...td, ...th }}>{figmaName}</td>
                  <td style={td}>
                    <Badge type="solid" severity={severity}>
                      Label
                    </Badge>
                  </td>
                  <td style={td}>
                    <Badge type="soft" severity={severity}>
                      Label
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section>
          <h3 style={h3}>Neutral chips — Filled / Border / Tabs (32px)</h3>
          <table style={{ borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={th}>Icon</th>
                <th style={th}>Filled</th>
                <th style={th}>Border</th>
                <th style={th}>Tabs</th>
              </tr>
            </thead>
            <tbody>
              {(
                [
                  ["None", {}],
                  ["Leading icon", { icon: <CheckGlyph /> }],
                  ["Trailing Icon", { count: 6, countLabel: "6 items" }],
                  ["Hybrid", { icon: <CheckGlyph />, count: 6, countLabel: "6 items" }],
                ] as const
              ).map(([name, props]) => (
                <tr key={name}>
                  <td style={{ ...td, ...th }}>{name}</td>
                  {(["filled", "border", "tabs"] as const).map((type) => (
                    <td style={td} key={type}>
                      <Badge type={type} severity="excellent" {...props}>
                        Label
                      </Badge>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>
    );
  },
};
