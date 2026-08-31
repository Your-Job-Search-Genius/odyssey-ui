import type { Meta, StoryObj } from "@storybook/react";
import { typography, fontFamily } from "../theme/typography";

const meta: Meta = {
  title: "Foundations/Typography",
  parameters: { layout: "padded" },
};

export default meta;
type Story = StoryObj;

export const TypeScale: Story = {
  name: "Type scale",
  render: () => (
    <div>
      <p style={{ maxWidth: 640, color: "#535862", marginBottom: 8 }}>
        Typeface: <strong>Geist</strong> (confirmed as the only typeface anywhere in the source
        Figma file). Fallback stack: <code style={{ fontSize: "0.75rem" }}>{fontFamily.base}</code>
      </p>
      <p style={{ maxWidth: 640, color: "#535862", marginBottom: 24, fontSize: "0.8125rem" }}>
        Geist is licensed under the SIL Open Font License 1.1 — free and safe for commercial use,
        and confirmed available on Google Fonts from this environment. This Storybook loads it for
        real (see the rendered specimens below); the package itself doesn&rsquo;t force that network
        request on every consumer — import <code>@writesea/odyssey-ui/fonts.css</code> to opt in,
        or self-host, or fall back to the system stack below.
      </p>
      {Object.entries(typography).map(([name, style]) => (
        <div key={name} style={{ marginBottom: 28, borderBottom: "1px solid #f6f6f6", paddingBottom: 20 }}>
          <div style={{ fontSize: "0.75rem", color: "#717680", marginBottom: 6, fontFamily: "monospace" }}>
            {name} — {style.fontWeight} · {style.fontSize} / {style.lineHeight} · tracking {style.letterSpacing}
          </div>
          <div
            style={{
              fontFamily: style.fontFamily,
              fontWeight: style.fontWeight,
              fontSize: style.fontSize,
              lineHeight: style.lineHeight,
              letterSpacing: style.letterSpacing,
              color: "#101419",
            }}
          >
            Reviewing your resume for keyword match
          </div>
        </div>
      ))}
    </div>
  ),
};
