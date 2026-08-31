import type { DOMAttributes, ReactElement, ReactNode } from "react";
import {
  MenuTrigger,
  Menu as AriaMenu,
  MenuItem,
  Popover,
  Pressable,
  Autocomplete as AriaAutocomplete,
  useFilter,
} from "react-aria-components";
import type { Key, Selection } from "react-aria-components";
import { CheckmarkSquare02Icon, CheckmarkSquare02SolidIcon, CheckmarkCircle02SolidIcon } from "@your-job-search-genius/icons";
import { SearchField } from "../SearchField/SearchField";
import "../Select/popover-menu.css";

/** Container chrome, from the three shapes on Figma's Dropdown page (433:9129). */
export type MenuVariant = "default" | "detailed" | "card";

export interface MenuAction {
  id: string;
  label: ReactNode;
  /**
   * Secondary line under the label — the file's "With description"
   * (433:9016) and "Dropdown Actions" (433:9091) rows. In the `detailed`
   * variant it promotes the label to 16px SemiBold above it.
   */
  description?: ReactNode;
  icon?: ReactNode;
  /** Replaces label/description entirely, for the file's "Job" row (433:9034). */
  content?: ReactNode;
  /** Trailing controls inside the row — the "Job with Actions" row's View/Delete pair. */
  actions?: ReactNode;
  disabled?: boolean;
  /** Styles the item with the danger text color (e.g. "Delete") — still text, per WCAG 1.4.1, never color alone as the only cue. */
  danger?: boolean;
}

export interface MenuProps {
  /**
   * A single trigger element (icon button, button, etc.) that forwards its
   * ref and spreads extra DOM props — every component in this library
   * qualifies. Wrapped internally in `Pressable` (not `Focusable` — that's
   * Tooltip's wrapper for hover/focus-only triggers; MenuTrigger needs the
   * full press + aria-expanded/aria-haspopup contract, verified by trying
   * Focusable first: aria-expanded/aria-haspopup never appeared and the
   * menu never opened). To disable the whole menu, disable this trigger
   * element itself (e.g. `<Button disabled>`) — MenuTrigger has no
   * generic disabled prop of its own to wire through an arbitrary child.
   */
  trigger: ReactElement;
  items: MenuAction[];
  onAction?: (id: Key) => void;
  placement?: "bottom start" | "bottom end" | "top start" | "top end";
  /**
   * `default` — 209px wide, 12px radius, 8px rows (Figma 433:9130).
   * `detailed` — 372px, 16px radius, roomy rows for descriptions or a
   * logo + two lines (433:9148, 433:9151).
   * `card` — 396px, 15px radius, rows that carry their own action
   * (433:9154).
   */
  variant?: MenuVariant;
  /**
   * Content above a rule at the top of the menu — the file's User Menu
   * puts its `MenuHeader` profile block here (433:9139). Presentational
   * only: it sits outside the `menu` element so it never lands in the
   * item collection, and anything focusable inside it would be unreachable
   * by the menu's arrow keys, so keep it to text and images.
   */
  header?: ReactNode;
  /**
   * Turns rows into checkable items — the file's "Select Menu" (433:9136),
   * whose rows carry a `checkmark-square-02` that fills with Primary/Base
   * when checked. React Aria switches the rows to `menuitemcheckbox` /
   * `menuitemradio` and manages `aria-checked` for us.
   */
  selectionMode?: "single" | "multiple";
  selectedKeys?: Selection;
  defaultSelectedKeys?: Selection;
  onSelectionChange?: (keys: Selection) => void;
  /**
   * Renders a `SearchField` above the menu items, wired to
   * `react-aria-components`' `Autocomplete` so typing filters the visible
   * rows in place — this library's own "filterable menu" recipe
   * (docs/design-inventory.md §2.14) for long action/option lists.
   */
  searchable?: boolean;
  /** Accessible name for the search field when `searchable` is set. */
  searchLabel?: string;
  searchPlaceholder?: string;
}

/**
 * Menu — built on `react-aria-components`' `MenuTrigger`/`Menu`/`MenuItem`:
 * roving-tabindex arrow-key navigation, typeahead, and `menu`/`menuitem`
 * role wiring are the error-prone part to hand-roll (WCAG doc §6). Shares
 * Select/ComboBox's popover chrome. This is the "Dropdown" page of the
 * Figma file (node 134:675) — its "Items" set is the row layouts below and
 * its "Menus" set is the three container variants.
 */
export function Menu({
  trigger,
  items,
  onAction,
  placement = "bottom start",
  variant = "default",
  header,
  selectionMode,
  selectedKeys,
  defaultSelectedKeys,
  onSelectionChange,
  searchable,
  searchLabel = "Search",
  searchPlaceholder,
}: MenuProps) {
  const { contains } = useFilter({ sensitivity: "base" });

  function layoutFor(item: MenuAction) {
    if (item.content) return "custom";
    if (variant === "card") return "card";
    if (item.description) return "description";
    if (selectionMode) return "check";
    return "default";
  }

  const menu = (
    <AriaMenu
      items={items}
      onAction={onAction}
      disabledKeys={items.filter((i) => i.disabled).map((i) => i.id)}
      selectionMode={selectionMode}
      selectedKeys={selectedKeys}
      defaultSelectedKeys={defaultSelectedKeys}
      onSelectionChange={onSelectionChange}
      className="wsu-Menu"
      data-variant={variant}
    >
          {(item) => (
            <MenuItem
              id={item.id}
              textValue={typeof item.label === "string" ? item.label : item.id}
              className="wsu-MenuItem"
              data-variant={item.danger ? "danger" : undefined}
              data-layout={layoutFor(item)}
            >
              {({ isSelected }) => (
                <>
                  {item.content ?? (
                    <>
                      {variant === "card" ? (
                        <span className="wsu-MenuItem__column">
                          <span className="wsu-MenuItem__row">
                            {item.icon ? (
                              <span className="wsu-MenuItem__icon" aria-hidden="true">
                                {item.icon}
                              </span>
                            ) : null}
                            {item.label}
                          </span>
                          {item.description ? <span className="wsu-MenuItem__description">{item.description}</span> : null}
                          {item.actions}
                        </span>
                      ) : item.description ? (
                        <>
                          {item.icon ? (
                            <span className="wsu-MenuItem__icon" aria-hidden="true">
                              {item.icon}
                            </span>
                          ) : null}
                          <span className="wsu-MenuItem__body">
                            <span className="wsu-MenuItem__title">{item.label}</span>
                            <span className="wsu-MenuItem__description">{item.description}</span>
                          </span>
                        </>
                      ) : (
                        <>
                          {item.icon ? (
                            <span className="wsu-MenuItem__icon" aria-hidden="true">
                              {item.icon}
                            </span>
                          ) : null}
                          {item.label}
                        </>
                      )}
                    </>
                  )}
                  {item.actions && variant !== "card" ? item.actions : null}
                  {selectionMode ? (
                    /* The card menu marks its chosen row with a 26px filled
                       checkmark-circle and leaves the others bare (433:9157);
                       every other menu carries the 20px square on both states. */
                    variant === "card" ? (
                      isSelected ? <CheckmarkCircle02SolidIcon size="1.625rem" className="wsu-MenuItem__mark" data-state="checked" /> : null
                    ) : isSelected ? (
                      <CheckmarkSquare02SolidIcon size="1.25rem" className="wsu-MenuItem__mark" data-state="checked" />
                    ) : (
                      <CheckmarkSquare02Icon size="1.25rem" className="wsu-MenuItem__mark" data-state="unchecked" />
                    )
                  ) : null}
                </>
              )}
            </MenuItem>
          )}
    </AriaMenu>
  );

  return (
    <MenuTrigger>
      <Pressable>{trigger as unknown as ReactElement<DOMAttributes<HTMLElement>, string>}</Pressable>
      <Popover
        placement={placement}
        className="wsu-Popover wsu-Popover--menu"
        data-variant={variant}
        data-selectable={selectionMode ? "" : undefined}
      >
        {header ? <div className="wsu-Menu__header">{header}</div> : null}
        {searchable ? (
          <AriaAutocomplete filter={contains}>
            <SearchField label={searchLabel} hideLabel placeholder={searchPlaceholder ?? searchLabel} className="wsu-Menu__search" />
            {menu}
          </AriaAutocomplete>
        ) : (
          menu
        )}
      </Popover>
    </MenuTrigger>
  );
}
