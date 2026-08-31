import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { expect, userEvent, within } from "@storybook/test";
import type { Selection } from "react-aria-components";
import { Menu, MenuHeader } from ".";
import { Button } from "../Button";
import {
  BriefcaseGlyph,
  EditGlyph,
  EyeGlyph,
  FileStarGlyph,
  FileUploadGlyph,
  PlusGlyph,
  RepeatGlyph,
  SearchListGlyph,
  TrashGlyph,
} from "../Icon/glyphs";

const meta: Meta<typeof Menu> = {
  title: "Figma Components/Composites/Menu",
  component: Menu,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "The Figma file's **Dropdown** page (node `134:675`). That page is two sets: *Items* (`433:8991`) — six row layouts, each in Default/Hover/Disabled — and *Menus* (`433:9129`) — six assemblies of those rows. Both collapse to one component here: `variant` picks the container (`default` 209px/12px radius, `detailed` 372px/16px, `card` 396px/15px) and each row picks its own layout from the props it is given (`description`, `content`, `actions`, `selectionMode`).\n\nBuilt on `react-aria-components`' MenuTrigger/Menu/MenuItem — roving-tabindex arrow-key navigation, typeahead, and the `menu`/`menuitem`/`menuitemcheckbox` role wiring are the error-prone part to hand-roll. **Use when:** a set of actions on an item, or a short checkable list. **Don't use when:** choosing a value for a form field (use `Select`, which needs a label, helper text and an error state) or navigating between pages (use links in a nav).\n\n**Two deviations from the file, both for contrast (WCAG 1.4.3).** The Delete row is `#fa1d37` in Figma — 3.97:1 on white — and ships as `text-danger` `#d30d25` (5.45:1). The description line is `#a4a7ae` in Figma — 2.41:1, the value of `text-disabled` sitting under a `text-subtle` variable — and ships as `text-subtle` `#717680` (4.56:1). Icons in these stories are house-style stand-ins: the file's own vectors are hosted on figma.com, which this environment cannot reach.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Menu>;

/* ------------------------------------------------------------------ *
 * The file's own examples, verbatim.
 * ------------------------------------------------------------------ */

/** The five rows of the Default menu, node 433:9130. */
const resumeItems = [
  { id: "default", label: "Make Default Resume", icon: <FileStarGlyph /> },
  { id: "review", label: "Review against a job", icon: <SearchListGlyph /> },
  { id: "edit", label: "Edit", icon: <EditGlyph /> },
  { id: "reanalyze", label: "Re-Analyze", icon: <RepeatGlyph /> },
  { id: "delete", label: "Delete", icon: <TrashGlyph />, danger: true },
];

/**
 * The Job row's brand mark. The file places the real Snapchat logo here;
 * a third-party logo isn't something this library ships, so the tile keeps
 * the file's exact geometry (44×43.48, 9.942px radius, 0.66px inside
 * stroke, 2.2px inner shadow) around a neutral glyph.
 */
function JobLogo() {
  return (
    <span className="wsu-MenuItem__logo" aria-hidden="true">
      <BriefcaseGlyph />
    </span>
  );
}

function jobContent() {
  return (
    <span className="wsu-MenuItem__group">
      <JobLogo />
      <span className="wsu-MenuItem__stack">
        <span className="wsu-MenuItem__eyebrow">SNAPCHAT</span>
        <span className="wsu-MenuItem__heading">Snr. Product Designer</span>
      </span>
    </span>
  );
}

/** Menus / Default — node 433:9130. */
export const FigmaDefaultMenu: Story = {
  name: "Figma — Default menu",
  render: () => <Menu trigger={<Button variant="secondary">Resume actions</Button>} items={resumeItems} />,
};

/** Menus / User Menu — node 433:9139: the Default rows under a profile header and rule. */
export const FigmaUserMenu: Story = {
  name: "Figma — User Menu",
  render: () => (
    <Menu
      trigger={<Button variant="secondary">Account</Button>}
      header={<MenuHeader initials="MC" name="Moremi Chris" detail="moremi@gmail.com" />}
      items={resumeItems}
    />
  ),
};

/** Menus / Variant3 — node 433:9148: two description rows in the 372px container. */
export const FigmaVariant3: Story = {
  name: "Figma — Variant3 (descriptions)",
  render: () => (
    <Menu
      trigger={<Button variant="secondary">New resume</Button>}
      variant="detailed"
      items={[
        {
          id: "upload",
          label: "Upload Existing Resume",
          description: "Upload your resume here to enhance and polish it.",
          icon: <FileUploadGlyph />,
        },
        {
          id: "scratch",
          label: "Start From Scratch",
          description: "Upload your resume here to enhance and polish it.",
          icon: <FileUploadGlyph />,
        },
      ]}
    />
  ),
};

/**
 * Menus / Select Menu — node 433:9136. The file's rows carry a
 * `checkmark-square-02` that fills with Primary/Base when checked, i.e. a
 * multi-select list; React Aria gives the rows `menuitemcheckbox` roles
 * and manages `aria-checked`.
 */
export const FigmaSelectMenu: Story = {
  name: "Figma — Select Menu",
  render: function SelectMenuStory() {
    const [selected, setSelected] = useState<Selection>(new Set(["option-2"]));
    return (
      <Menu
        trigger={<Button variant="secondary">Options</Button>}
        selectionMode="multiple"
        selectedKeys={selected}
        onSelectionChange={setSelected}
        items={[
          { id: "option-1", label: "Option 1" },
          { id: "option-2", label: "Option 2" },
        ]}
      />
    );
  },
};

/** Menus / Job Menu — node 433:9151. */
export const FigmaJobMenu: Story = {
  name: "Figma — Job Menu",
  render: () => (
    <Menu
      trigger={<Button variant="secondary">Recent jobs</Button>}
      variant="detailed"
      items={[
        { id: "job-1", label: "Snr. Product Designer", content: jobContent() },
        { id: "job-2", label: "Snr. Product Designer", content: jobContent() },
      ]}
    />
  ),
};

/** Menus / Dropdown Actions Card Menu — node 433:9154. */
export const FigmaCardMenu: Story = {
  name: "Figma — Dropdown Actions Card Menu",
  render: function CardMenuStory() {
    const [selected, setSelected] = useState<Selection>(new Set(["card-2"]));
    return (
      <Menu
        trigger={<Button variant="secondary">Choose an action</Button>}
        variant="card"
        selectionMode="single"
        selectedKeys={selected}
        onSelectionChange={setSelected}
        items={[
          { id: "card-1", label: "Title Header", description: "Description", icon: <SearchListGlyph /> },
          { id: "card-2", label: "Title Header", description: "Description", icon: <SearchListGlyph /> },
        ]}
      />
    );
  },
};

/**
 * Items / Dropdown Actions — node 433:9091. The item type carries its own
 * button below the description; the card menu above drops it.
 */
export const FigmaDropdownActionsItem: Story = {
  name: "Figma — Dropdown Actions item (with button)",
  render: () => (
    <Menu
      trigger={<Button variant="secondary">Add a section</Button>}
      variant="card"
      items={[
        {
          id: "add",
          label: "Title Header",
          description: "Description",
          icon: <SearchListGlyph />,
          actions: (
            <Button variant="secondary" size="sm" leadingIcon={<PlusGlyph />}>
              Button
            </Button>
          ),
        },
      ]}
    />
  ),
};

/**
 * Items / Job with Actions — node 433:9042. The file's own View button is a
 * Button instance with local overrides (a `#e2e2e2` border, 10px radius and
 * 8px padding, none of which match the Buttons page); the system Button
 * ships instead, and the override is logged in docs/design-inventory.md §2.6.
 */
export const FigmaJobWithActions: Story = {
  name: "Figma — Job with Actions item",
  render: () => (
    <Menu
      trigger={<Button variant="secondary">Applications</Button>}
      variant="detailed"
      items={[
        {
          id: "job-1",
          label: "Snr. Product Designer",
          content: jobContent(),
          actions: (
            <span className="wsu-MenuItem__actions">
              <Button variant="secondary" size="sm" leadingIcon={<EyeGlyph />}>
                View
              </Button>
              <TrashGlyph size="md" />
            </span>
          ),
        },
      ]}
    />
  ),
};

/* ------------------------------------------------------------------ *
 * States and behavior.
 * ------------------------------------------------------------------ */

/** Items / *, State=Disabled — the file's third state for every row type. */
export const DisabledItems: Story = {
  render: () => (
    <Menu
      trigger={<Button variant="secondary">Resume actions</Button>}
      items={resumeItems.map((item) => ({ ...item, disabled: item.id !== "edit" }))}
    />
  ),
};

export const Placements: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "3rem", padding: "3rem" }}>
      {(["bottom start", "bottom end", "top start", "top end"] as const).map((placement) => (
        <Menu key={placement} trigger={<Button variant="secondary">{placement}</Button>} items={resumeItems} placement={placement} />
      ))}
    </div>
  ),
};

export const KeyboardInteraction: Story = {
  render: () => <Menu trigger={<Button variant="secondary">Actions</Button>} items={resumeItems} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole("button", { name: "Actions" });
    trigger.focus();
    await userEvent.keyboard("{Enter}");
    await expect(await canvas.findByRole("menu")).toBeInTheDocument();
    await userEvent.keyboard("{Escape}");
    await expect(canvas.queryByRole("menu")).not.toBeInTheDocument();
  },
};
