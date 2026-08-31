import type { Meta, StoryObj } from "@storybook/react";
import { expect, userEvent, within } from "@storybook/test";
import { Select } from "./Select";

const items = [
  { id: "resume", label: "Resume" },
  { id: "cover-letter", label: "Cover letter" },
  { id: "portfolio", label: "Portfolio", disabled: true },
];

const meta: Meta<typeof Select> = {
  title: "Figma Components/Composites/Select",
  component: Select,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Built on `react-aria-components`' Select/ListBox/Popover — restyling a native `<select>` to this degree while keeping its popup accessible isn't possible, so the behavior layer owns `combobox`/`listbox` roles, typeahead, and keyboard nav entirely. Shares its popover/listbox chrome (popover-menu.css) with Combobox and Menu. **Use when:** choosing one value from a closed, known list. **Don't use when:** the user needs to type/filter (use Combobox) or more than one value can be chosen.",
      },
    },
  },
  args: { label: "Document type", items },
};

export default meta;
type Story = StoryObj<typeof Select>;

export const Playground: Story = {};

export const WithHelperText: Story = {
  args: { helperText: "Used for the export filename." },
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
    const trigger = canvas.getByRole("button");
    trigger.focus();
    await userEvent.keyboard("{Enter}");
    await expect(await canvas.findByRole("listbox")).toBeInTheDocument();
    await userEvent.keyboard("{ArrowDown}");
    await userEvent.keyboard("{Enter}");
    await expect(trigger).toHaveTextContent("Cover letter");
  },
};
