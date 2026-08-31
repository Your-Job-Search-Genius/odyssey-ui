import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { expect, userEvent, within } from "@storybook/test";
import { CommandPalette } from "./CommandPalette";
import { Button } from "../Button";
import { PencilIcon, FileStarIcon, RepeatIcon, SearchList01Icon, Delete02Icon } from "@your-job-search-genius/icons";

const items = [
  { id: "default", label: "Make Default Resume", icon: <FileStarIcon /> },
  { id: "review", label: "Review against a job", icon: <SearchList01Icon /> },
  { id: "edit", label: "Edit", icon: <PencilIcon /> },
  { id: "reanalyze", label: "Re-Analyze", icon: <RepeatIcon /> },
  { id: "delete", label: "Delete", icon: <Delete02Icon /> },
];

function Demo(props: Partial<React.ComponentProps<typeof CommandPalette>>) {
  const [isOpen, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>
        {/* opacity dims this below the 4.5:1 AA contrast floor against the button's purple background — kept at full opacity instead */}
        Open command palette <kbd style={{ marginInlineStart: "0.5rem", fontFamily: "inherit" }}>⌘J</kbd>
      </Button>
      <CommandPalette isOpen={isOpen} onOpenChange={setOpen} items={items} {...props} />
    </>
  );
}

const meta: Meta<typeof CommandPalette> = {
  title: "Custom Components/CommandPalette",
  component: CommandPalette,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "**Not in the source Figma file.** Composed from primitives already in this library — `Modal`'s overlay mechanics (scrim, focus trap, portal) around the same `Autocomplete` + `SearchField` + `Menu` pieces the searchable `Menu`/`Select`/`Table` variants use — rather than a distinct Figma component. Opens via ⌘J/Ctrl+J from anywhere by default, or via a controlled `isOpen`/`onOpenChange` pair. **Use when:** a global, keyboard-first way to search and act on a long list of commands/actions. **Don't use when:** the action set is short and tied to one trigger (use `Menu`).",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof CommandPalette>;

export const Playground: Story = {
  render: () => <Demo />,
};

export const OpenByDefault: Story = {
  name: "Open by default (for visual review)",
  // Excluded from the generated docs page: autodocs renders every story of
  // this component inline in the same iframe, so an always-open story here
  // would mount unprompted (and steal focus) the instant the docs page
  // loads. Still reachable at its own story URL for manual visual review.
  tags: ["!autodocs"],
  render: function OpenDemo() {
    const [isOpen, setOpen] = useState(true);
    return <CommandPalette isOpen={isOpen} onOpenChange={setOpen} items={items} enableShortcut={false} />;
  },
};

export const FilterAndAct: Story = {
  name: "Filter and run a command",
  render: () => <Demo enableShortcut={false} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: /Open command palette/ }));
    const search = await canvas.findByRole("searchbox", { name: "Search commands" });
    await userEvent.type(search, "delete");
    const item = await canvas.findByRole("menuitem", { name: "Delete" });
    await expect(item).toBeInTheDocument();
    await expect(canvas.queryByRole("menuitem", { name: "Edit" })).not.toBeInTheDocument();
    await userEvent.click(item);
    await expect(canvas.queryByRole("dialog")).not.toBeInTheDocument();
  },
};

export const KeyboardShortcut: Story = {
  name: "⌘J / Ctrl+J opens the palette",
  render: () => <Demo />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.keyboard("{Control>}j{/Control}");
    await expect(await canvas.findByRole("dialog")).toBeInTheDocument();
  },
};
