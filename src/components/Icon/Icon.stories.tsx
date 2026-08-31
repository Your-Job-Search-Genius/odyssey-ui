import type { Meta, StoryObj } from "@storybook/react";
import { Icon } from "./Icon";
import {
  AlertCircleGlyph,
  CalendarGlyph,
  CheckGlyph,
  ChevronDownGlyph,
  CloseGlyph,
  EyeGlyph,
  InfoCircleGlyph,
  MinusGlyph,
  SearchGlyph,
} from "./glyphs";

const meta: Meta<typeof Icon> = {
  title: "Figma Components/Primitives/Icon",
  component: Icon,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Base SVG wrapper: inherits `currentColor`, sizes from the icon-size token scale, and is hidden from screen readers unless given a `label`. **Use when:** wrapping any glyph, decorative or informational. **Don't use when:** the icon sits inside an already-labeled control (e.g. an icon-only Button) — label the control itself, not the icon, to avoid a doubled-up accessible name. The full Writesea Odyssey glyph set has not been extracted from Figma yet; the glyphs shown here are internal placeholder shapes.",
      },
    },
  },
  argTypes: {
    size: { control: "select", options: ["xs", "sm", "md", "lg", "xl"] },
  },
};

export default meta;
type Story = StoryObj<typeof Icon>;

export const Sizes: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
      {(["xs", "sm", "md", "lg", "xl"] as const).map((size) => (
        <CheckGlyph key={size} size={size} label={`Check, ${size}`} />
      ))}
    </div>
  ),
};

export const Decorative: Story = {
  render: () => <CheckGlyph />,
  parameters: {
    docs: { description: { story: "No `label` — hidden from assistive tech (`aria-hidden`)." } },
  },
};

export const Labeled: Story = {
  render: () => <AlertCircleGlyph label="Warning" />,
  parameters: {
    docs: { description: { story: "With a `label` — exposed as `role=\"img\"` with an accessible name." } },
  },
};

export const InheritsColor: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "1rem", color: "var(--wsu-color-text-danger)" }}>
      <AlertCircleGlyph label="Error" />
      <span style={{ font: "var(--wsu-font-body-md)" }}>Icon color follows the surrounding text color.</span>
    </div>
  ),
};

export const Glyphs: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
      {[CheckGlyph, MinusGlyph, CloseGlyph, ChevronDownGlyph, AlertCircleGlyph, InfoCircleGlyph, SearchGlyph, EyeGlyph, CalendarGlyph].map(
        (Glyph, i) => (
          <div key={i} style={{ padding: "0.5rem", border: "1px solid var(--wsu-color-border-default)", borderRadius: "var(--wsu-radius-sm)" }}>
            <Glyph label={Glyph.name} />
          </div>
        ),
      )}
    </div>
  ),
};
