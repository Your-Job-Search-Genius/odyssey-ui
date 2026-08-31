import type { Meta, StoryObj } from "@storybook/react";
import { BadgeGroup } from "./BadgeGroup";
import { CheckGlyph } from "../Icon/glyphs";

const meta: Meta<typeof BadgeGroup> = {
  title: "Figma Components/Primitives/BadgeGroup",
  component: BadgeGroup,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "A two-part chip from Figma node 433:5019: a neutral half carrying content and a coloured half carrying a label, joined into one rounded shape. Only the outer corners round, via logical properties, so it stays correct with the badge on either side and under RTL. **AA note:** the file fills the badge with `#3488ff` behind white 14px text, which is 3.44:1 — under the 4.5:1 floor. It uses blue/600 (4.89:1) instead, the nearest passing shade of the same hue.",
      },
    },
  },
  argTypes: {
    layout: { control: "inline-radio", options: ["inline", "stacked"] },
    badgePosition: { control: "inline-radio", options: ["leading", "trailing"] },
  },
  args: { label: "Label", children: "“I’m just a guy who loves tech 🚀”" },
};

export default meta;
type Story = StoryObj<typeof BadgeGroup>;

export const Playground: Story = {};

/** Every Content x Layout x Has Icon x Title Position combination the file defines. */
export const FigmaMatrix: Story = {
  name: "Figma matrix (layout x icon x position)",
  render: (args) => {
    const th = {
      font: "var(--wsu-font-body-sm)",
      color: "var(--wsu-color-text-body)",
      textAlign: "left",
      padding: "0 1.5rem 0.5rem 0",
      whiteSpace: "nowrap",
    } as const;
    const td = { padding: "0 1.5rem 1rem 0", verticalAlign: "top" } as const;

    return (
      <table style={{ borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={th}>Layout</th>
            <th style={th}>Icon, badge trailing</th>
            <th style={th}>Icon, badge leading</th>
            <th style={th}>No icon, trailing</th>
            <th style={th}>No icon, leading</th>
          </tr>
        </thead>
        <tbody>
          {(["inline", "stacked"] as const).map((layout) => (
            <tr key={layout}>
              <td style={{ ...td, ...th }}>{layout}</td>
              <td style={td}>
                <BadgeGroup {...args} layout={layout} badgePosition="trailing" icon={<CheckGlyph />} />
              </td>
              <td style={td}>
                <BadgeGroup {...args} layout={layout} badgePosition="leading" icon={<CheckGlyph />} />
              </td>
              <td style={td}>
                <BadgeGroup {...args} layout={layout} badgePosition="trailing" />
              </td>
              <td style={td}>
                <BadgeGroup {...args} layout={layout} badgePosition="leading" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  },
};

/** The file's three Content types are just different children — Input, Rating and Header. */
export const ContentTypes: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem", alignItems: "flex-start" }}>
      <BadgeGroup label="Voice" icon={<CheckGlyph />}>
        “I’m just a guy who loves tech 🚀”
      </BadgeGroup>
      <BadgeGroup label="4.8" icon={<CheckGlyph />}>
        Rating
      </BadgeGroup>
      <BadgeGroup label="New" badgePosition="leading">
        Section header
      </BadgeGroup>
    </div>
  ),
};
