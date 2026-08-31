import type { Meta, StoryObj } from "@storybook/react";
import { expect, fn, userEvent, within } from "@storybook/test";
import { Link } from "./Link";

const meta: Meta<typeof Link> = {
  title: "Custom Components/Link",
  component: Link,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          '**Not in the source Figma file.** Built directly on `react-aria-components`\' `Link` — the same primitive `Breadcrumb` already composes for each crumb, extracted here as a standalone, in-flow text link. Renders a real `<a>` when given an `href` (native browser navigation, works without JS); without one it renders a `<span role="link">` driven entirely by `onPress`.',
      },
    },
  },
  args: {
    children: "React Aria",
    href: "https://react-spectrum.adobe.com/react-aria/",
  },
};

export default meta;
type Story = StoryObj<typeof Link>;

export const Playground: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const link = canvas.getByRole("link", { name: "React Aria" });
    await expect(link).toHaveAttribute("href", "https://react-spectrum.adobe.com/react-aria/");
  },
};

export const Disabled: Story = {
  args: { isDisabled: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const link = canvas.getByRole("link", { name: "React Aria" });
    await expect(link).toHaveAttribute("aria-disabled", "true");
  },
};

export const PressHandler: Story = {
  name: "onPress (no href)",
  args: { href: undefined, onPress: fn(), children: "Press me" },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const link = canvas.getByRole("link", { name: "Press me" });
    await expect(link.tagName).toBe("SPAN");
    await userEvent.click(link);
    await expect(args.onPress).toHaveBeenCalledTimes(1);
  },
};
