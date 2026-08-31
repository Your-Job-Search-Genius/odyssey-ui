import type { Meta, StoryObj } from "@storybook/react";
import { expect, userEvent, within } from "@storybook/test";
import { Button } from "./Button";
import { Tick01Icon, ArrowRight01SharpIcon, MultiplicationSignIcon } from "@your-job-search-genius/icons";

const meta: Meta<typeof Button> = {
  title: "Figma Components/Primitives/Button",
  component: Button,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Native `<button>` — no behavior library needed, the platform already gets keyboard/focus/activation right. **Use when:** the primary way to trigger an action or submit a form. **Don't use when:** navigating to a new URL (use a link) or toggling a persistent on/off state (use a switch/checkbox). Icon-only buttons (`leadingIcon` with no children) require `aria-label`, enforced by the type.",
      },
    },
  },
  argTypes: {
    variant: { control: "select", options: ["primary", "secondary", "accent", "text"] },
    size: { control: "select", options: ["sm", "md", "lg"] },
    loading: { control: "boolean" },
    disabled: { control: "boolean" },
    fullWidth: { control: "boolean" },
  },
  args: {
    children: "Button",
    variant: "primary",
    size: "lg",
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Playground: Story = {};

export const Variants: Story = {
  render: (args) => (
    <div style={{ display: "flex", gap: "0.75rem" }}>
      <Button {...args} variant="primary">Primary</Button>
      <Button {...args} variant="secondary">Secondary</Button>
      <Button {...args} variant="accent">Accent</Button>
      <Button {...args} variant="text">Text</Button>
    </div>
  ),
};

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
      <Button {...args} size="sm">Small</Button>
      <Button {...args} size="md">Medium</Button>
      <Button {...args} size="lg">Large</Button>
    </div>
  ),
};

export const WithIcons: Story = {
  render: (args) => (
    <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
      <Button {...args} leadingIcon={<Tick01Icon />}>Leading icon</Button>
      <Button {...args} trailingIcon={<ArrowRight01SharpIcon />}>Trailing icon</Button>
      <Button {...args} leadingIcon={<MultiplicationSignIcon />} aria-label="Close" />
    </div>
  ),
};

export const States: Story = {
  render: (args) => (
    <div style={{ display: "flex", gap: "0.75rem" }}>
      <Button {...args}>Default</Button>
      <Button {...args} disabled>Disabled</Button>
      <Button {...args} loading>Loading</Button>
    </div>
  ),
};

export const FullWidth: Story = {
  args: { fullWidth: true },
  render: (args) => (
    <div style={{ width: "20rem" }}>
      <Button {...args}>Full width</Button>
    </div>
  ),
};

export const KeyboardInteraction: Story = {
  args: { children: "Press me" },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole("button", { name: "Press me" });
    await userEvent.tab();
    await expect(button).toHaveFocus();
    await userEvent.keyboard("{Enter}");
    await userEvent.keyboard(" ");
  },
};

/**
 * The complete Figma matrix from node 71:90584 — every Style x Size x Type
 * the file defines, in the file's own order, so it can be diffed directly.
 * Hover and focus are live states rather than static rows: hover a cell or
 * tab through it to see them.
 */
export const FigmaMatrix: Story = {
  name: "Figma matrix (all styles x sizes x types)",
  parameters: {
    docs: {
      description: {
        story:
          "Every variant on Figma's Buttons page. Disabled is shown as its own column group; hover/focus are reproduced by interacting, since they're real states here rather than separate components.",
      },
    },
  },
  render: () => {
    const styles = ["primary", "secondary", "accent", "text"] as const;
    const sizes = [
      ["lg", "Default"],
      ["md", "Medium"],
      ["sm", "Small"],
    ] as const;
    const label = { primary: "Primary", secondary: "Secondary", accent: "Accent", text: "Button Text" };

    const cell = { display: "flex", alignItems: "center", gap: "0.75rem" } as const;
    const th = {
      font: "var(--wsu-font-body-sm)",
      color: "var(--wsu-color-text-body)",
      textAlign: "left",
      padding: "0 1rem 0.5rem 0",
      whiteSpace: "nowrap",
    } as const;
    const td = { padding: "0 1rem 0.75rem 0", verticalAlign: "middle" } as const;

    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "2.5rem" }}>
        {styles.map((variant) => (
          <section key={variant}>
            <h3
              style={{
                font: "var(--wsu-font-heading-sm)",
                color: "var(--wsu-color-text-heading)",
                margin: "0 0 1rem",
                textTransform: "capitalize",
              }}
            >
              {variant}
            </h3>
            <table style={{ borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th style={th}>Size</th>
                  <th style={th}>Default</th>
                  <th style={th}>Leading icon</th>
                  <th style={th}>Trailing icon</th>
                  <th style={th}>Loading</th>
                  <th style={th}>Icon only</th>
                  <th style={th}>Disabled</th>
                </tr>
              </thead>
              <tbody>
                {sizes.map(([size, figmaName]) => (
                  <tr key={size}>
                    <td style={{ ...td, ...th }}>{figmaName}</td>
                    <td style={td}>
                      <div style={cell}>
                        <Button variant={variant} size={size}>
                          {label[variant]}
                        </Button>
                      </div>
                    </td>
                    <td style={td}>
                      <Button variant={variant} size={size} leadingIcon={<Tick01Icon />}>
                        {label[variant]}
                      </Button>
                    </td>
                    <td style={td}>
                      <Button variant={variant} size={size} trailingIcon={<ArrowRight01SharpIcon />}>
                        {label[variant]}
                      </Button>
                    </td>
                    <td style={td}>
                      <Button variant={variant} size={size} loading>
                        {label[variant]}
                      </Button>
                    </td>
                    <td style={td}>
                      <Button variant={variant} size={size} leadingIcon={<MultiplicationSignIcon />} aria-label="Close" />
                    </td>
                    <td style={td}>
                      <Button variant={variant} size={size} disabled>
                        {label[variant]}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        ))}
      </div>
    );
  },
};
