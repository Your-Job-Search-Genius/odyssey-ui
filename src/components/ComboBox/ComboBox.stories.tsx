import type { Meta, StoryObj } from "@storybook/react";
import { expect, userEvent, within } from "@storybook/test";
import { ComboBox } from "./ComboBox";

const items = [
  { id: "resume", label: "Resume" },
  { id: "cover-letter", label: "Cover letter" },
  { id: "portfolio", label: "Portfolio", disabled: true },
];

const meta: Meta<typeof ComboBox> = {
  title: "Figma Components/Composites/ComboBox",
  component: ComboBox,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Built on `react-aria-components`' ComboBox — a Select plus free-text filtering, which raises the same restyling problem with a larger accessible-name/typeahead surface to get right. Opens on focus (not just typing) and stays open to show a \"No matches\" state when filtering empties the list — both are this library's own UX choices layered on top of the defaults. **Use when:** choosing from a long list where typing to filter helps. **Don't use when:** the list is short (use Select) or free text unrelated to the list should be accepted (use Input).",
      },
    },
  },
  args: { label: "Document type", items },
};

export default meta;
type Story = StoryObj<typeof ComboBox>;

export const Playground: Story = {};

export const WithHelperText: Story = {
  args: { helperText: "Start typing to filter." },
};

export const ErrorState: Story = {
  name: "Error (designed, not in Figma)",
  args: { errorMessage: "Choose a document type." },
};

export const Disabled: Story = {
  args: { disabled: true, defaultSelectedKey: "resume" },
};

export const KeyboardInteraction: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole("combobox");
    await userEvent.click(input);
    await expect(await canvas.findByRole("listbox")).toBeInTheDocument();
    await userEvent.keyboard("{ArrowDown}{Enter}");
    await expect(input).toHaveValue("Resume");
  },
};
