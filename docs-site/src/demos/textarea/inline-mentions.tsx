import { useEffect, useId, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { Autocomplete, Menu, MenuItem, Popover, useFilter } from "react-aria-components";
import { Textarea } from "@your-job-search-genius/odyssey-ui";

const usernames = [
  "alexmiller",
  "sarahjones",
  "davidkim",
  "emmawatson",
  "oliverliu",
  "ellagreen",
  "lucasbrown",
  "amandarivera",
];

/**
 * Inline @mention completions — the `react-aria-components` docs' own
 * recipe: `Autocomplete`'s `inputValue` is set to a *substring* of the
 * field's full value (the text between the last `@` and the caret), so
 * filtering only ever considers that fragment while the field itself still
 * shows everything typed. The popover is anchored to the whole field via
 * `Popover`'s `triggerRef` rather than the exact caret pixel.
 */
export default function TextareaInlineMentions() {
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
    <div style={{ width: "20rem" }}>
      <style>{`
        .docs-MentionPopover {
          min-width: var(--trigger-width);
          background-color: var(--wsu-color-surface-default);
          border: 0.75px solid var(--wsu-color-border-default);
          border-radius: var(--wsu-radius-md);
          box-shadow: var(--wsu-shadow-lg);
          overflow: hidden;
        }
        .docs-MentionMenu {
          display: flex;
          flex-direction: column;
          gap: 0.4375rem;
          padding: 0.625rem;
          max-height: 16rem;
          overflow-y: auto;
          outline: none;
        }
        .docs-MentionMenu__empty {
          display: flex;
          align-items: center;
          justify-content: center;
          padding-block: var(--wsu-space-4);
          font: var(--wsu-font-body-sm);
          color: var(--wsu-color-text-subtle);
        }
        .docs-MentionItem {
          display: flex;
          align-items: center;
          padding-inline: var(--wsu-space-2);
          padding-block: 0.375rem;
          min-height: 1.75rem;
          border-radius: var(--wsu-radius-sm);
          font: var(--wsu-font-body-sm);
          color: var(--wsu-color-text-heading);
          cursor: pointer;
          outline: none;
        }
        .docs-MentionItem[data-hovered],
        .docs-MentionItem[data-focused],
        .docs-MentionItem[data-highlighted] {
          background-color: var(--wsu-color-secondary-bg-hover);
        }
        .docs-MentionItem[data-focus-visible] {
          box-shadow: var(--wsu-shadow-focus-ring-inset);
        }
      `}</style>
      <Autocomplete inputValue={filterValue} filter={startsWith}>
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
          className="docs-MentionPopover"
        >
          <Menu
            id={menuId}
            items={usernames.map((name) => ({ id: name }))}
            renderEmptyState={() => <div className="docs-MentionMenu__empty">No matches</div>}
            className="docs-MentionMenu"
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
                className="docs-MentionItem"
                data-highlighted={highlightedUsername === item.id ? "true" : undefined}
              >
                @{item.id}
              </MenuItem>
            )}
          </Menu>
        </Popover>
      </Autocomplete>
    </div>
  );
}
