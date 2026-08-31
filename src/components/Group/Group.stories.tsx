import type { Meta, StoryObj } from "@storybook/react";
import { expect, userEvent, within } from "@storybook/test";
import { Button } from "../Button";
import { Input } from "../Input";
import { Group } from "./Group";

const meta: Meta<typeof Group> = {
  title: "Custom Components/Group",
  component: Group,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "**Not in the source Figma file.** Built on `react-aria-components`' `Group` — a styled container for a set of related controls that reports hover/focus-within/disabled/invalid state as data attributes, so the whole set shares one field box and one focus ring instead of each control drawing its own. **Use when:** composing a segmented input, or an input paired with an inline button. **Don't use when:** a single control already draws its own field box (e.g. `Input`, `ColorField`) — wrapping it in a `Group` would nest two boxes.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Group>;

export const Playground: Story = {
  render: () => (
    <Group>
      <Input
        unstyled
        style={{ width: "3ch", boxSizing: "content-box" }}
        maxLength={3}
        label="First 3 digits"
        placeholder="000"
      />
      –
      <Input
        unstyled
        style={{ width: "2ch", boxSizing: "content-box" }}
        maxLength={2}
        label="Middle 2 digits"
        placeholder="00"
      />
      –
      <Input
        unstyled
        style={{ width: "4ch", boxSizing: "content-box" }}
        maxLength={4}
        label="Last 4 digits"
        placeholder="0000"
      />
    </Group>
  ),
};

export const WithInlineButton: Story = {
  name: "Input paired with an inline button",
  render: () => (
    <Group style={{ width: 280 }}>
      <Input
        unstyled
        style={{ flex: 1, minWidth: 0 }}
        label="Promo code"
        placeholder="Promo code"
      />
      <Button size="sm" variant="text">
        Apply
      </Button>
    </Group>
  ),
};

export const Disabled: Story = {
  render: () => (
    <Group disabled>
      <Input unstyled aria-label="Value" placeholder="Disabled" disabled />
    </Group>
  ),
};

export const Invalid: Story = {
  name: "Invalid (designed, not in Figma)",
  render: () => (
    <Group invalid>
      <Input unstyled aria-label="Value" placeholder="Invalid" />
    </Group>
  ),
};

export const FocusRingSurroundsWholeGroup: Story = {
  name: "Focusing any child shows one shared ring",
  render: () => (
    <Group>
      <Input
        unstyled
        style={{ width: "3ch", boxSizing: "content-box" }}
        maxLength={3}
        label="First 3 digits"
        placeholder="000"
      />
      –
      <Input
        unstyled
        style={{ width: "2ch", boxSizing: "content-box" }}
        maxLength={2}
        label="Middle 2 digits"
        placeholder="00"
      />
    </Group>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const group = canvasElement.querySelector(".wsu-Group") as HTMLElement;
    const firstInput = canvas.getByLabelText("First 3 digits");
    await userEvent.click(firstInput);
    expect(group).toHaveAttribute("data-focus-within");
  },
};
