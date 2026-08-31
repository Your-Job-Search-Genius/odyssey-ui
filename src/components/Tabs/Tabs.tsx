import { forwardRef } from "react";
import type { ReactNode } from "react";
import {
  Tabs as AriaTabs,
  TabList as AriaTabList,
  Tab as AriaTab,
  TabPanel as AriaTabPanel,
} from "react-aria-components";
import type { Key } from "react-aria-components";
import "./Tabs.css";

export interface TabsProps {
  children: ReactNode;
  selectedKey?: Key;
  defaultSelectedKey?: Key;
  onSelectionChange?: (key: Key) => void;
  orientation?: "horizontal" | "vertical";
  /**
   * `automatic` (default) selects a tab the moment arrow-key focus lands on
   * it; `manual` moves focus only, requiring Enter/Space to select. Use
   * `manual` when showing a panel is expensive (network fetch, heavy DOM),
   * so arrowing through the list doesn't churn panels the user is skipping past.
   */
  keyboardActivation?: "automatic" | "manual";
  /**
   * Disables every tab at once (e.g. while a form the tabs belong to is
   * submitting) without hand-mapping `disabled: true` onto each `TabItem`.
   * The current selection stays visible — only interaction is blocked.
   */
  isDisabled?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Tabs — compound component built on `react-aria-components` (`Tabs` /
 * `TabList` / `Tab` / `TabPanel`): arrow-key navigation between tabs plus
 * the `tablist`/`tab`/`tabpanel` role and `aria-selected`/`aria-controls`
 * wiring is the error-prone part to hand-roll (WCAG doc §6).
 *
 * Figma's Tabs page only shows a selected-vs-unselected pill; there is no
 * hover, disabled, or focus-visible treatment anywhere in the source file
 * (confirmed structurally, not a sampling gap — see docs/design-inventory.md
 * §2.8). Those three states here are assumed from WAI-ARIA APG conventions
 * plus this system's shared hover-tint/focus-ring language.
 */
export const Tabs = forwardRef<HTMLDivElement, TabsProps>(function Tabs(
  { children, selectedKey, defaultSelectedKey, onSelectionChange, orientation = "horizontal", keyboardActivation, isDisabled, className, style },
  ref,
) {
  return (
    <AriaTabs
      ref={ref}
      selectedKey={selectedKey}
      defaultSelectedKey={defaultSelectedKey}
      onSelectionChange={onSelectionChange}
      orientation={orientation}
      keyboardActivation={keyboardActivation}
      isDisabled={isDisabled}
      className={className ? `wsu-Tabs ${className}` : "wsu-Tabs"}
      style={style}
    >
      {children}
    </AriaTabs>
  );
});

export interface TabItem {
  id: Key;
  label: ReactNode;
  disabled?: boolean;
  /**
   * Renders the tab as a real `<a>` for tabs that are also navigation
   * (one URL per tab). With a client router wired up via react-aria's
   * `RouterProvider`, selection then follows the current URL.
   */
  href?: string;
}

export interface TabListProps {
  /** Visible label for the tab list, or supply `aria-label` directly. */
  "aria-label": string;
  items: TabItem[];
}

export function TabList({ items, ...rest }: TabListProps) {
  return (
    <AriaTabList items={items} className="wsu-TabList" {...rest}>
      {(item) => (
        <AriaTab id={item.id} isDisabled={item.disabled} href={item.href} className="wsu-Tab">
          {item.label}
        </AriaTab>
      )}
    </AriaTabList>
  );
}

export interface TabPanelProps {
  id: Key;
  children: ReactNode;
  className?: string;
  /**
   * Keeps this panel mounted (but inert) while another tab is selected,
   * instead of unmounting it — use for panels that hold state that would
   * otherwise be lost on switch, e.g. unsaved form fields, scroll position,
   * or in-progress media playback.
   */
  shouldForceMount?: boolean;
}

export function TabPanel({ id, children, className, shouldForceMount }: TabPanelProps) {
  return (
    <AriaTabPanel id={id} className={className ? `wsu-TabPanel ${className}` : "wsu-TabPanel"} shouldForceMount={shouldForceMount}>
      {children}
    </AriaTabPanel>
  );
}
