import { forwardRef } from "react";
import type { ReactNode } from "react";
import { ToggleButton as AriaToggleButton, ToggleButtonGroup as AriaToggleButtonGroup } from "react-aria-components";
import type { Key } from "react-aria-components";
import "./ToggleButton.css";

export type ToggleButtonSize = "sm" | "md" | "lg";

interface ToggleButtonCommonProps {
  /** When used in a `ToggleButtonGroup`, an identifier for the item in `selectedKeys`. When used standalone, a DOM id. */
  id?: Key;
  /** Defaults to `lg`, matching `Button`. */
  size?: ToggleButtonSize;
  /** Ignored when inside a `ToggleButtonGroup` — the group drives selection for the whole set instead. */
  selected?: boolean;
  defaultSelected?: boolean;
  onChange?: (selected: boolean) => void;
  disabled?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export type ToggleButtonProps =
  | (ToggleButtonCommonProps & { children: ReactNode; "aria-label"?: string })
  | (ToggleButtonCommonProps & { children?: undefined; "aria-label": string });

/**
 * ToggleButton — built on `react-aria-components`' `ToggleButton`: correct
 * `aria-pressed` toggle semantics (WAI-ARIA APG "button" pattern — distinct
 * from a checkbox's `aria-checked`) plus hover/press/focus-visible state.
 * Works standalone (e.g. a "favorite" star, a lone Bold toggle) or as a
 * child of `ToggleButtonGroup`, which drives selection for the whole set
 * through context — in that case omit `selected`/`defaultSelected`/
 * `onChange` here and control the group instead. Not in the source Figma
 * file at all (design-inventory.md §2.14); chrome reuses `Button`'s
 * secondary-variant geometry (per-size height/padding/icon slot) so a
 * standalone `ToggleButton` sits on the same baseline as a `Button` beside
 * it, with a selected fill borrowed from `TagGroup`'s `Tag`
 * `data-selected` treatment (primary-bg, on-primary text) rather than a
 * new visual language.
 *
 * Icon-only usage (`children` omitted) requires `aria-label` — TypeScript
 * enforces it, same as `Button` (WCAG 2.5.3 Label in Name, 4.1.2).
 */
export const ToggleButton = forwardRef<HTMLButtonElement, ToggleButtonProps>(function ToggleButton(
  { id, size = "lg", selected, defaultSelected, onChange, disabled, className, style, children, "aria-label": ariaLabel },
  ref,
) {
  const isIconOnly = children === undefined;
  const classes = [
    "wsu-ToggleButton",
    `wsu-ToggleButton--${size}`,
    isIconOnly ? "wsu-ToggleButton--icon-only" : "",
    className ?? "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <AriaToggleButton
      ref={ref}
      id={id}
      aria-label={ariaLabel}
      isSelected={selected}
      defaultSelected={defaultSelected}
      onChange={onChange}
      isDisabled={disabled}
      className={classes}
      style={style}
    >
      {children}
    </AriaToggleButton>
  );
});

export interface ToggleButtonGroupProps {
  /** `ToggleButton` children, each given a stable `id`. */
  children: ReactNode;
  /** Whether one or several buttons in the set may be selected at once. Defaults to `single`. */
  selectionMode?: "single" | "multiple";
  /** When `true`, a `single`-mode group can't be toggled down to nothing (e.g. text alignment, which always has a value). */
  disallowEmptySelection?: boolean;
  selectedKeys?: Iterable<Key>;
  defaultSelectedKeys?: Iterable<Key>;
  onSelectionChange?: (keys: Set<Key>) => void;
  disabled?: boolean;
  /** `horizontal` (default) or `vertical`. */
  orientation?: "horizontal" | "vertical";
  className?: string;
  style?: React.CSSProperties;
  "aria-label"?: string;
  "aria-labelledby"?: string;
}

/**
 * ToggleButtonGroup — built on `react-aria-components`' `ToggleButtonGroup`.
 * Keyboard model is the WAI-ARIA APG "toolbar" pattern (roving tabindex:
 * arrow keys move focus only) even in `single` mode, where each item also
 * gets `role="radio"`/`aria-checked` for how a screen reader announces it —
 * selecting an item still needs its own activation (click, or Enter/Space
 * once focused), it doesn't follow focus the way a native `<input
 * type="radio">` group's does. This is what makes a row of `ToggleButton`s
 * behave as one control instead of N independent ones — a text-alignment or
 * bold/italic/underline toolbar should use this rather than wiring each
 * `ToggleButton`'s own `selected`/`onChange`. Requires `aria-label` or
 * `aria-labelledby` (WCAG 4.1.2), since unlike `RadioGroup`/`CheckboxGroup`
 * there's no visible `<Label>` slot — a toolbar is typically labeled by
 * context (e.g. "Text formatting") rather than a heading of its own.
 */
export const ToggleButtonGroup = forwardRef<HTMLDivElement, ToggleButtonGroupProps>(function ToggleButtonGroup(
  {
    children,
    selectionMode = "single",
    disallowEmptySelection,
    selectedKeys,
    defaultSelectedKeys,
    onSelectionChange,
    disabled,
    orientation = "horizontal",
    className,
    style,
    ...rest
  },
  ref,
) {
  return (
    <AriaToggleButtonGroup
      ref={ref}
      selectionMode={selectionMode}
      disallowEmptySelection={disallowEmptySelection}
      selectedKeys={selectedKeys}
      defaultSelectedKeys={defaultSelectedKeys}
      onSelectionChange={onSelectionChange}
      isDisabled={disabled}
      orientation={orientation}
      className={className ? `wsu-ToggleButtonGroup ${className}` : "wsu-ToggleButtonGroup"}
      style={style}
      {...rest}
    >
      {children}
    </AriaToggleButtonGroup>
  );
});
