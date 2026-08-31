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
  { children, selectedKey, defaultSelectedKey, onSelectionChange, orientation = "horizontal", className, style },
  ref,
) {
  return (
    <AriaTabs
      ref={ref}
      selectedKey={selectedKey}
      defaultSelectedKey={defaultSelectedKey}
      onSelectionChange={onSelectionChange}
      orientation={orientation}
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
        <AriaTab id={item.id} isDisabled={item.disabled} className="wsu-Tab">
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
}

export function TabPanel({ id, children, className }: TabPanelProps) {
  return (
    <AriaTabPanel id={id} className={className ? `wsu-TabPanel ${className}` : "wsu-TabPanel"}>
      {children}
    </AriaTabPanel>
  );
}
