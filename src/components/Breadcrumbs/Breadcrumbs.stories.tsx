import type { Meta, StoryObj } from "@storybook/react";
import { expect, fn, userEvent, within } from "@storybook/test";
import { useState } from "react";
import type { Key } from "react-aria-components";
import { Breadcrumbs, Breadcrumb } from "./Breadcrumbs";

const meta: Meta<typeof Breadcrumbs> = {
  title: "Custom Components/Breadcrumbs",
  component: Breadcrumbs,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "**Not in the source Figma file.** Built on `react-aria-components`' `Breadcrumbs`/`Breadcrumb`/`Link`. The last crumb is `isCurrent` automatically and renders as plain (non-interactive) text; every other crumb is a `Link` followed by a chevron separator. Supports both static children and the dynamic `items`/render-function collection API, plus `onAction` for click-driven navigation instead of `href`s.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Breadcrumbs>;

export const Playground: Story = {
  render: (args) => (
    <Breadcrumbs {...args}>
      <Breadcrumb href="#">Home</Breadcrumb>
      <Breadcrumb href="#">React Aria</Breadcrumb>
      <Breadcrumb>Breadcrumbs</Breadcrumb>
    </Breadcrumbs>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const home = canvas.getByRole("link", { name: "Home" });
    await expect(home).toHaveAttribute("href", "#");
    // The last crumb has no href — react-aria-components still exposes it
    // with role="link" for landmark parity, but disabled (no href, aria-disabled,
    // not tab-reachable) and marked aria-current="page".
    const current = canvas.getByRole("link", { name: "Breadcrumbs" });
    await expect(current).not.toHaveAttribute("href");
    await expect(current).toHaveAttribute("aria-current", "page");
    await expect(current).toHaveAttribute("aria-disabled", "true");
  },
};

export const Dynamic: Story = {
  name: "Dynamic (items + onAction)",
  render: function Render() {
    const [crumbs, setCrumbs] = useState([
      { id: 1, label: "Home" },
      { id: 2, label: "Trendy" },
      { id: 3, label: "March 2022 Assets" },
    ]);

    const navigate = (key: Key) => {
      const i = crumbs.findIndex((item) => item.id === key);
      setCrumbs(crumbs.slice(0, i + 1));
    };

    return (
      <Breadcrumbs items={crumbs} onAction={navigate}>
        {(item) => <Breadcrumb>{item.label}</Breadcrumb>}
      </Breadcrumbs>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("March 2022 Assets")).toBeInTheDocument();
    await userEvent.click(canvas.getByRole("link", { name: "Home" }));
    await expect(canvas.queryByText("Trendy")).not.toBeInTheDocument();
    await expect(canvas.getByText("Home")).toBeInTheDocument();
  },
};

export const DisabledCrumb: Story = {
  name: "Disabled crumb (designed, not in Figma)",
  args: { onAction: fn() },
  render: (args) => (
    <Breadcrumbs {...args}>
      <Breadcrumb href="#">Home</Breadcrumb>
      <Breadcrumb href="#" isDisabled>
        Archived
      </Breadcrumb>
      <Breadcrumb>Current</Breadcrumb>
    </Breadcrumbs>
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const archived = canvas.getByRole("link", { name: "Archived" });
    await expect(archived).toHaveAttribute("aria-disabled", "true");
    await expect(archived.tagName).toBe("SPAN");
    await userEvent.click(archived);
    await expect(args.onAction).not.toHaveBeenCalled();
  },
};

export const AllDisabled: Story = {
  name: "Breadcrumbs.isDisabled (whole trail)",
  args: { isDisabled: true },
  render: (args) => (
    <Breadcrumbs {...args}>
      <Breadcrumb href="#">Home</Breadcrumb>
      <Breadcrumb href="#">React Aria</Breadcrumb>
      <Breadcrumb>Breadcrumbs</Breadcrumb>
    </Breadcrumbs>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("link", { name: "Home" })).toHaveAttribute("aria-disabled", "true");
  },
};
