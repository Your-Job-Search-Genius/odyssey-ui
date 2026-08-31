import { useEffect, useId, useRef, useState } from "react";
import { flushSync } from "react-dom";
import type { Meta, StoryObj } from "@storybook/react";
import { expect, userEvent, within } from "@storybook/test";
import {
  Autocomplete as AriaAutocomplete,
  Menu as AriaMenu,
  MenuItem,
  Popover,
  useFilter,
} from "react-aria-components";
import { Textarea } from "./Textarea";
import "../Select/popover-menu.css";

const usernames = ["alexmiller", "sarahjones", "davidkim", "emmawatson", "oliverliu", "ellagreen", "lucasbrown", "amandarivera"];

/**
 * Inline @mention completions — the `react-aria-components` docs' own
 * recipe (not a shipped component there either): `Autocomplete`'s
 * `inputValue` is set to a *substring* of the field's full value (the text
 * between the last `@` and the caret), so filtering only ever considers
 * that fragment while the field itself still shows everything typed.
 *
 * The upstream recipe positions the popover at the exact caret pixel via
 * the `textarea-caret` package, which this library doesn't depend on and
 * won't add for a single story. Anchored to the whole field with `Popover`'s
 * `triggerRef` instead — the filtering and insertion behavior is identical,
 * only the popover's exact on-screen position differs. Not in the source
 * Figma file (design-inventory.md §2.14) — this is a composition recipe
 * over existing components (`Textarea`, `Menu`'s row chrome), not a new one.
 */
function MentionTextareaExample() {
  const { startsWith } = useFilter({ sensitivity: "base" });
  const [value, setValue] = useState("");
  const [anchorIndex, setAnchorIndex] = useState(-1);
  const [filterValue, setFilterValue] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const itemIdsRef = useRef<Record<string, string>>({});
  const menuId = useId();

  const isOpen = anchorIndex >= 0;
  const filteredUsernames = isOpen ? usernames.filter((name) => startsWith(name, filterValue)) : [];
  const highlightedUsername = filteredUsernames[Math.min(highlightedIndex, filteredUsernames.length - 1)];

  // The filtered list shrinks/reorders as the user types, so the highlight
  // is reset to the top match rather than tracking a now-stale index.
  useEffect(() => {
    setHighlightedIndex(0);
  }, [filterValue]);

  function updateFilter() {
    const el = textareaRef.current;
    if (!el) return;
    const { selectionStart, selectionEnd, value: current } = el;
    if (selectionStart === selectionEnd && document.activeElement === el) {
      const index = current.lastIndexOf("@", selectionStart - 1);
      if (index >= 0) {
        const slice = current.slice(index + 1, selectionStart);
        if (!slice.includes(" ") && !slice.includes("\n")) {
          setAnchorIndex(index);
          setFilterValue(slice);
          return;
        }
      }
    }
    setAnchorIndex(-1);
  }

  function selectUser(username: string) {
    const prefix = `${value.slice(0, anchorIndex)}@${username} `;
    const suffix = value.slice(textareaRef.current?.selectionEnd ?? value.length);
    flushSync(() => setValue(prefix + suffix));
    textareaRef.current?.setSelectionRange(prefix.length, prefix.length);
    textareaRef.current?.focus();
    updateFilter();
  }

  return (
    <div style={{ width: 320 }}>
      <AriaAutocomplete inputValue={filterValue} filter={startsWith}>
        <Textarea
          label="Comment"
          placeholder="Type @ to mention someone"
          value={value}
          ref={textareaRef}
          onChange={(event) => {
            setValue(event.target.value);
            updateFilter();
          }}
          onSelect={updateFilter}
          onBlur={updateFilter}
          onKeyDown={(event) => {
            if (!isOpen) return;
            switch (event.key) {
              case "ArrowDown":
                if (filteredUsernames.length === 0) break;
                event.preventDefault();
                setHighlightedIndex((i) => (i + 1) % filteredUsernames.length);
                break;
              case "ArrowUp":
                if (filteredUsernames.length === 0) break;
                event.preventDefault();
                setHighlightedIndex((i) => (i - 1 + filteredUsernames.length) % filteredUsernames.length);
                break;
              case "Enter":
                if (!highlightedUsername) break;
                event.preventDefault();
                selectUser(highlightedUsername);
                break;
              case "Escape":
                event.preventDefault();
                setAnchorIndex(-1);
                break;
              default:
                break;
            }
          }}
          aria-activedescendant={highlightedUsername ? itemIdsRef.current[highlightedUsername] : undefined}
          aria-controls={isOpen ? menuId : undefined}
        />
        <Popover
          triggerRef={textareaRef}
          isOpen={isOpen}
          onOpenChange={(open) => !open && setAnchorIndex(-1)}
          isNonModal
          placement="bottom start"
          className="wsu-Popover wsu-Popover--menu"
        >
          <AriaMenu
            id={menuId}
            items={usernames.map((name) => ({ id: name }))}
            renderEmptyState={() => <div className="wsu-Menu__empty">No matches</div>}
            className="wsu-Menu"
            aria-label="Mention a user"
            onAction={(key) => selectUser(String(key))}
          >
            {(item) => (
              <MenuItem
                id={item.id}
                ref={(el) => {
                  if (el) itemIdsRef.current[item.id] = el.id;
                }}
                textValue={item.id}
                className="wsu-MenuItem"
                data-highlighted={highlightedUsername === item.id ? "true" : undefined}
              >
                @{item.id}
              </MenuItem>
            )}
          </AriaMenu>
        </Popover>
      </AriaAutocomplete>
    </div>
  );
}

const meta: Meta = {
  title: "Custom Components/Textarea/Inline @mentions (recipe)",
  parameters: {
    docs: {
      description: {
        component:
          "A composition recipe, not a new component: `Textarea` plus `react-aria-components`' `Autocomplete`/`Popover`/`Menu`, following the same pattern upstream's docs demonstrate for inline @mention completions. See the source of this story for the full implementation.",
      },
    },
  },
};

export default meta;
type Story = StoryObj;

export const Playground: Story = {
  render: () => <MentionTextareaExample />,
};

export const TypeAndSelect: Story = {
  name: "Typing @ opens matching users",
  render: () => <MentionTextareaExample />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const field = canvas.getByRole("textbox", { name: "Comment" });
    await userEvent.click(field);
    await userEvent.type(field, "Hey @sarah");
    const option = await canvas.findByRole("menuitem", { name: "@sarahjones" });
    await expect(option).toBeInTheDocument();
    await userEvent.click(option);
    await expect(field).toHaveValue("Hey @sarahjones ");
  },
};

export const SelectWithKeyboard: Story = {
  name: "Arrow keys and Enter select a match",
  render: () => <MentionTextareaExample />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const field = canvas.getByRole("textbox", { name: "Comment" });
    await userEvent.click(field);
    await userEvent.type(field, "Hey @a");
    await canvas.findByRole("menuitem", { name: "@alexmiller" });
    await expect(canvas.getByRole("menuitem", { name: "@amandarivera" })).toBeInTheDocument();

    // Cycle past both matches and back with the arrow keys, then select
    // the highlighted one with Enter — no mouse involved.
    await userEvent.keyboard("{ArrowDown}{ArrowDown}{ArrowUp}{Enter}");
    await expect(field).toHaveValue("Hey @amandarivera ");
  },
};

export const DismissWithEscape: Story = {
  name: "Escape closes the popup without inserting a mention",
  render: () => <MentionTextareaExample />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const field = canvas.getByRole("textbox", { name: "Comment" });
    await userEvent.click(field);
    await userEvent.type(field, "Hey @dav");
    await canvas.findByRole("menuitem", { name: "@davidkim" });
    await userEvent.keyboard("{Escape}");
    await expect(canvas.queryByRole("menuitem")).not.toBeInTheDocument();
    await expect(field).toHaveValue("Hey @dav");
  },
};
