import { forwardRef } from "react";
import type { ReactNode, Ref } from "react";
import {
  Disclosure as AriaDisclosure,
  DisclosurePanel as AriaDisclosurePanel,
  DisclosureGroup as AriaDisclosureGroup,
  Button,
  Heading,
} from "react-aria-components";
import type { Key } from "react-aria-components";
import { ArrowDown01SharpIcon } from "@your-job-search-genius/icons";
import "./Disclosure.css";

export interface DisclosureProps {
  /** id of the disclosure — required to control it from a parent DisclosureGroup's `expandedKeys`. */
  id?: string;
  children: ReactNode;
  expanded?: boolean;
  defaultExpanded?: boolean;
  onExpandedChange?: (expanded: boolean) => void;
  disabled?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Disclosure — no Figma node covers this component yet (not in
 * docs/design-inventory.md), so its chrome is assembled from existing
 * tokens/patterns rather than a cited source: the chevron treatment
 * mirrors Card's and Sidebar's (`ArrowDown01SharpIcon`, rotate 180deg on
 * expand), and spacing/type follow the shared token scale. Built on
 * `react-aria-components`' `Disclosure` (rather than a native
 * `<details>`/`<summary>` like Card/Sidebar use) so it can compose with
 * `DisclosureGroup`'s controlled/uncontrolled `expandedKeys` set — that
 * multi-item coordination has no native HTML equivalent.
 */
export const Disclosure = forwardRef<HTMLDivElement, DisclosureProps>(function Disclosure(
  { id, children, expanded, defaultExpanded, onExpandedChange, disabled, className, style },
  ref,
) {
  return (
    <AriaDisclosure
      ref={ref}
      id={id}
      isExpanded={expanded}
      defaultExpanded={defaultExpanded}
      onExpandedChange={onExpandedChange}
      isDisabled={disabled}
      className={className ? `wsu-Disclosure ${className}` : "wsu-Disclosure"}
      style={style}
    >
      {children}
    </AriaDisclosure>
  );
});

export interface DisclosureHeaderProps {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export function DisclosureHeader({ children, className, style }: DisclosureHeaderProps) {
  return (
    <Heading className={className} style={style}>
      <Button slot="trigger" className="wsu-Disclosure__trigger">
        <ArrowDown01SharpIcon size="1rem" className="wsu-Disclosure__chevron" aria-hidden="true" />
        <span className="wsu-Disclosure__label">{children}</span>
      </Button>
    </Heading>
  );
}

export interface DisclosurePanelProps {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const DisclosurePanel = forwardRef<HTMLDivElement, DisclosurePanelProps>(function DisclosurePanel(
  { children, className, style },
  ref,
) {
  return (
    <AriaDisclosurePanel
      ref={ref as Ref<HTMLDivElement>}
      className={className ? `wsu-DisclosurePanel ${className}` : "wsu-DisclosurePanel"}
      style={style}
    >
      <div className="wsu-DisclosurePanel__content">{children}</div>
    </AriaDisclosurePanel>
  );
});

export interface DisclosureGroupProps {
  children: ReactNode;
  /** Whether more than one Disclosure in the group may be expanded at once. */
  allowsMultipleExpanded?: boolean;
  expandedKeys?: Iterable<Key>;
  defaultExpandedKeys?: Iterable<Key>;
  onExpandedChange?: (keys: Set<Key>) => void;
  disabled?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * DisclosureGroup — a set of `Disclosure`s (an accordion). Membership is
 * wired via each child `Disclosure`'s `id`, matched against
 * `expandedKeys`/`defaultExpandedKeys`, not via index — same convention as
 * every other keyed collection in this library (Tabs, Select, etc.).
 */
export const DisclosureGroup = forwardRef<HTMLDivElement, DisclosureGroupProps>(function DisclosureGroup(
  { children, allowsMultipleExpanded, expandedKeys, defaultExpandedKeys, onExpandedChange, disabled, className, style },
  ref,
) {
  return (
    <AriaDisclosureGroup
      ref={ref}
      allowsMultipleExpanded={allowsMultipleExpanded}
      expandedKeys={expandedKeys}
      defaultExpandedKeys={defaultExpandedKeys}
      onExpandedChange={onExpandedChange}
      isDisabled={disabled}
      className={className ? `wsu-DisclosureGroup ${className}` : "wsu-DisclosureGroup"}
      style={style}
    >
      {children}
    </AriaDisclosureGroup>
  );
});
