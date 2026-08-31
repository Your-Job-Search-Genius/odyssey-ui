import type { Meta, StoryObj } from "@storybook/react";
import { createTheme, ThemeProvider } from "../theme";
import { Button } from "../components/Button";
import { Badge } from "../components/Badge";
import { Input } from "../components/Input";
import { Checkbox } from "../components/Checkbox";

const meta: Meta = {
  title: "Foundations/Theming",
  parameters: { layout: "padded" },
};

export default meta;
type Story = StoryObj;

// A complete example: reskinning the library's primary/danger colors for a
// consumer's own brand, without forking anything. createTheme() deep-merges
// this into the defaults and — in development — re-audits every text/
// background pairing for AA contrast, including ones this override
// introduces (open the browser console on this story to see it run clean).
const oceanTheme = createTheme({
  colors: {
    "primary-bg": "#0B5FFF",
    "primary-bg-hover": "#0A4FD1",
    "primary-bg-active": "#0842A8",
    "primary-bg-disabled": "#AFC9FF",
    "primary-text": "#FFFFFF",
    "border-focus": "#0B5FFF",
    "field-border-focus": "#0B5FFF",
    "focus-ring": "rgba(11,95,255,0.45)",
    "danger-bg": "#B3261E",
    "danger-bg-hover": "#8C1D17",
    "text-danger": "#8C1D17",
  },
});

export const CustomBrandTheme: Story = {
  name: "Custom brand theme (via createTheme + ThemeProvider)",
  render: () => (
    <div style={{ display: "flex", gap: 48, flexWrap: "wrap" }}>
      <div>
        <h4 style={{ marginBottom: 12 }}>Default theme</h4>
        <ThemeProvider>
          <Demo />
        </ThemeProvider>
      </div>
      <div>
        <h4 style={{ marginBottom: 12 }}>Custom &ldquo;Ocean&rdquo; brand theme</h4>
        <ThemeProvider theme={oceanTheme}>
          <Demo />
        </ThemeProvider>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: `
A consumer installs the package and re-skins it like this:

\`\`\`tsx
import { createTheme, ThemeProvider } from "@writesea/odyssey-ui";

const oceanTheme = createTheme({
  colors: {
    "primary-bg": "#0B5FFF",
    "primary-bg-hover": "#0A4FD1",
    "primary-text": "#FFFFFF",
    "border-focus": "#0B5FFF",
    // ...any semantic token
  },
});

function App() {
  return (
    <ThemeProvider theme={oceanTheme}>
      <YourApp />
    </ThemeProvider>
  );
}
\`\`\`

No forking, no rebuilding the package — every component already reads its colors from
\`--wsu-color-*\` custom properties, which \`ThemeProvider\` applies inline, scoped to its subtree.
Nest a second \`ThemeProvider\` anywhere to scope a different theme to just part of the tree.

In development, \`createTheme()\` re-audits contrast for the *resulting* theme, not just the
defaults — if your override makes a pairing fail AA, you'll see a \`console.warn\` naming exactly
which pairing and its ratio.
        `,
      },
    },
  },
};

function Demo() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, width: 220 }}>
      <Button>Primary action</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="primary" disabled>
        Disabled
      </Button>
      <Badge severity="fail" type="solid">
        Failing
      </Badge>
      <Checkbox label="Remember me" defaultChecked />
      <Input label="Email" placeholder="you@example.com" />
    </div>
  );
}
