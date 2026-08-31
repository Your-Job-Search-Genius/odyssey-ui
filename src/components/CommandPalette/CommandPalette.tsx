import { useEffect, useRef } from "react";
import type { ReactNode } from "react";
import {
  ModalOverlay as AriaModalOverlay,
  Modal as AriaModal,
  Dialog as AriaDialog,
  Autocomplete as AriaAutocomplete,
  Menu as AriaMenu,
  MenuItem,
  useFilter,
} from "react-aria-components";
import type { Key } from "react-aria-components";
import { SearchField } from "../SearchField/SearchField";
import "../Select/popover-menu.css";
import "./CommandPalette.css";

export interface CommandPaletteOption {
  id: string;
  label: ReactNode;
  description?: ReactNode;
  icon?: ReactNode;
  disabled?: boolean;
}

export interface CommandPaletteProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  items: CommandPaletteOption[];
  onAction?: (id: Key) => void;
  /** Accessible name for the search field. Defaults to "Search commands". */
  label?: string;
  placeholder?: string;
  renderEmptyState?: () => ReactNode;
  /** Registers the global ⌘J / Ctrl+J shortcut to open the palette. Defaults to true. */
  enableShortcut?: boolean;
}

/**
 * CommandPalette — the "search + act on a long list from anywhere" pattern
 * from `react-aria-components`' own docs, composed from primitives already
 * in this library: `ModalOverlay`/`Modal`/`Dialog` (Modal's own overlay
 * mechanics — scrim, focus trap, portal, WCAG doc §6) around
 * `Autocomplete`/`SearchField`/`Menu` (the same filterable-menu pieces the
 * searchable `Menu`/`Select`/`Table` variants use). Not `Modal` itself: a
 * command palette's frame carries no title/header/footer chrome, which
 * `Modal`'s API requires a title for, so this builds directly on the same
 * underlying react-aria-components primitives with its own minimal frame.
 * Not in the source Figma file at all (design-inventory.md §2.14).
 */
export function CommandPalette({
  isOpen,
  onOpenChange,
  items,
  onAction,
  label = "Search commands",
  placeholder,
  renderEmptyState = () => <div className="wsu-Menu__empty">No results found.</div>,
  enableShortcut = true,
}: CommandPaletteProps) {
  const { contains } = useFilter({ sensitivity: "base" });
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Not the `autoFocus` DOM prop (flagged by jsx-a11y/no-autofocus, which guards against
  // yanking focus on page load) — this dialog only exists once explicitly opened by the
  // user, and moving focus into it is mandatory regardless (WCAG doc §6); the search field
  // is the dialog's one meaningful interactive target, so focus goes there imperatively.
  useEffect(() => {
    if (isOpen) searchInputRef.current?.focus();
  }, [isOpen]);

  useEffect(() => {
    if (!enableShortcut) return;
    const isMacUA = /mac(os|intosh)/i.test(navigator.userAgent);
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "j" && (isMacUA ? event.metaKey : event.ctrlKey)) {
        event.preventDefault();
        onOpenChange(true);
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [enableShortcut, onOpenChange]);

  return (
    <AriaModalOverlay isOpen={isOpen} onOpenChange={onOpenChange} isDismissable className="wsu-CommandPalette__overlay">
      <AriaModal className="wsu-CommandPalette">
        <AriaDialog className="wsu-CommandPalette__dialog" aria-label="Command palette">
          <AriaAutocomplete filter={contains}>
            <SearchField ref={searchInputRef} label={label} hideLabel placeholder={placeholder ?? label} className="wsu-CommandPalette__search" />
            <AriaMenu
              items={items}
              onAction={(key) => {
                onAction?.(key);
                onOpenChange(false);
              }}
              disabledKeys={items.filter((i) => i.disabled).map((i) => i.id)}
              renderEmptyState={renderEmptyState}
              className="wsu-Menu wsu-CommandPalette__menu"
              aria-label="Commands"
            >
              {(item) => (
                <MenuItem id={item.id} textValue={typeof item.label === "string" ? item.label : item.id} className="wsu-MenuItem" data-layout={item.description ? "description" : "default"}>
                  {item.icon ? (
                    <span className="wsu-MenuItem__icon" aria-hidden="true">
                      {item.icon}
                    </span>
                  ) : null}
                  {item.description ? (
                    <span className="wsu-MenuItem__body">
                      <span className="wsu-MenuItem__title">{item.label}</span>
                      <span className="wsu-MenuItem__description">{item.description}</span>
                    </span>
                  ) : (
                    item.label
                  )}
                </MenuItem>
              )}
            </AriaMenu>
          </AriaAutocomplete>
        </AriaDialog>
      </AriaModal>
    </AriaModalOverlay>
  );
}
