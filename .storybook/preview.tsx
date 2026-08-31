import type { Preview } from "@storybook/react";
import React from "react";
import { ThemeProvider } from "../src/theme/ThemeProvider";
import "../src/theme/tokens.css";
import "../src/theme/reset.css";
// Storybook loads the real Geist typeface so stories are pixel-accurate to
// Figma — this is opt-in for consumers of the package itself, see theme/fonts.css.
import "../src/theme/fonts.css";

const preview: Preview = {
  parameters: {
    controls: { expanded: true },
    a11y: {
      config: {
        rules: [],
      },
      options: {
        runOnly: {
          type: "tag",
          values: ["wcag2a", "wcag2aa", "wcag22aa"],
        },
      },
    },
    backgrounds: {
      default: "surface",
      values: [
        { name: "surface", value: "#ffffff" },
        { name: "subtle", value: "#fafafa" },
        { name: "dark", value: "#101419" },
      ],
    },
  },
  decorators: [
    (Story) => (
      <ThemeProvider>
        <div style={{ padding: "1.5rem", fontFamily: "var(--wsu-font-family)" }}>
          <Story />
        </div>
      </ThemeProvider>
    ),
  ],
};

export default preview;
