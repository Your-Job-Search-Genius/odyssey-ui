import { forwardRef } from "react";
import type { ReactNode } from "react";
import { ArrowDown01SharpIcon } from "@your-job-search-genius/icons";
import "./Sidebar.css";

export interface SidebarItemData {
  id: string;
  label: ReactNode;
  /** Ignored on a child/submenu item — Figma's submenu rows have no icon slot at all (see SidebarSubItem). */
  icon?: ReactNode;
  href?: string;
  onClick?: () => void;
  /** Nested items — rendered as a `<details>`/`<summary>` disclosure, same reasoning as Card. Only one level deep, matching the source file. */
  children?: SidebarItemData[];
}

export interface SidebarProps {
  /** Landmark label (WCAG: a page with more than one `<nav>` needs each one named). */
  "aria-label": string;
  items: SidebarItemData[];
  /** id of the currently active item — rendered with `aria-current="page"` and the active-rail indicator, never color alone. */
  activeId?: string;
  /** Optional block above the nav list — Figma's frame puts a workspace/institution identity here. */
  header?: ReactNode;
  /** Optional block below the nav list, bottom-aligned when the nav is given a fixed height. */
  footer?: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * The rail is a real inline element (the row's first flex child, matching
 * Figma's "Sidebar item background" layer — a 2x22px bar that sits *inside*
 * the item's own padding) rather than an absolutely-positioned `::before`
 * hanging outside the item's box. It's always in the DOM, transparent
 * unless active, so hover/active never reflow the row.
 */
function SidebarRail() {
  return <span className="wsu-Sidebar__rail" aria-hidden="true" />;
}

/** Top-level rows only — Figma's child/submenu rows have no icon or rail slot (see SidebarSubItem). */
function SidebarItem({ item, activeId, depth }: { item: SidebarItemData; activeId?: string; depth: number }) {
  const isActive = item.id === activeId;

  if (item.children?.length) {
    const isBranchActive = hasActiveDescendant(item, activeId);
    return (
      <li>
        <details className="wsu-Sidebar__details" open={isBranchActive}>
          <summary className="wsu-Sidebar__item wsu-Sidebar__item--parent" data-depth={depth}>
            <SidebarRail />
            {item.icon ? (
              <span className="wsu-Sidebar__icon" aria-hidden="true">
                {item.icon}
              </span>
            ) : null}
            <span className="wsu-Sidebar__label">{item.label}</span>
            {/* Figma sizes the disclosure chevron the same 18px as the item icons. */}
            <ArrowDown01SharpIcon size="var(--wsu-sidebar-icon-size)" className="wsu-Sidebar__chevron" />
          </summary>
          <div className="wsu-Sidebar__subrow">
            {/* Figma tints the connector primary when the branch holds the active
                item — that node's only colors are Primary/Base, Primary/25 and
                Gray/Base, with no border gray anywhere in it. */}
            <span
              className="wsu-Sidebar__connector"
              data-active={isBranchActive || undefined}
              aria-hidden="true"
            />
            <ul className="wsu-Sidebar__sublist">
              {item.children.map((child) => (
                <SidebarSubItem key={child.id} item={child} activeId={activeId} />
              ))}
            </ul>
          </div>
        </details>
      </li>
    );
  }

  return (
    <li>
      {item.href ? (
        <a
          href={item.href}
          className="wsu-Sidebar__item"
          data-depth={depth}
          aria-current={isActive ? "page" : undefined}
        >
          <SidebarRail />
          {item.icon ? (
            <span className="wsu-Sidebar__icon" aria-hidden="true">
              {item.icon}
            </span>
          ) : null}
          <span className="wsu-Sidebar__label">{item.label}</span>
        </a>
      ) : (
        <button
          type="button"
          onClick={item.onClick}
          className="wsu-Sidebar__item"
          data-depth={depth}
          aria-current={isActive ? "page" : undefined}
        >
          <SidebarRail />
          {item.icon ? (
            <span className="wsu-Sidebar__icon" aria-hidden="true">
              {item.icon}
            </span>
          ) : null}
          <span className="wsu-Sidebar__label">{item.label}</span>
        </button>
      )}
    </li>
  );
}

/**
 * Submenu rows (depth 1) — Figma's "Mock Interview"/"Job Preparation"/
 * "Question Bank" rows are plain text pills with no icon and no rail; the
 * active one gets a tinted pill background instead of the top-level rail
 * treatment. Only one level of nesting is defined in the source file, so
 * this doesn't recurse into further children.
 */
function SidebarSubItem({ item, activeId }: { item: SidebarItemData; activeId?: string }) {
  const isActive = item.id === activeId;
  const content = <span className="wsu-Sidebar__label">{item.label}</span>;

  return (
    <li>
      {item.href ? (
        <a href={item.href} className="wsu-Sidebar__subitem" aria-current={isActive ? "page" : undefined}>
          {content}
        </a>
      ) : (
        <button
          type="button"
          onClick={item.onClick}
          className="wsu-Sidebar__subitem"
          aria-current={isActive ? "page" : undefined}
        >
          {content}
        </button>
      )}
    </li>
  );
}

function hasActiveDescendant(item: SidebarItemData, activeId?: string): boolean {
  if (!activeId || !item.children) return false;
  return item.children.some((child) => child.id === activeId || hasActiveDescendant(child, activeId));
}

/**
 * Sidebar — plain semantic `<nav>`/`<ul>`, no behavior library needed.
 * Nested items use `<details>`/`<summary>` for the same reason as Card:
 * native keyboard/expanded-state support for free. Ships the Default and
 * Expanded states Figma actually differentiates — the file's "Minimized"
 * property rendered pixel-identical to "Expanded" in every sample pulled,
 * so a true icon-only collapsed rail isn't implemented (see
 * docs/design-inventory.md §2.11); revisit if design confirms it should
 * exist.
 */
export const Sidebar = forwardRef<HTMLElement, SidebarProps>(function Sidebar(
  { items, activeId, header, footer, className, style, ...rest },
  ref,
) {
  return (
    <nav ref={ref} className={className ? `wsu-Sidebar ${className}` : "wsu-Sidebar"} style={style} {...rest}>
      {header ? <div className="wsu-Sidebar__header">{header}</div> : null}
      <ul className="wsu-Sidebar__list">
        {items.map((item) => (
          <SidebarItem key={item.id} item={item} activeId={activeId} depth={0} />
        ))}
      </ul>
      {footer ? <div className="wsu-Sidebar__footer">{footer}</div> : null}
    </nav>
  );
});
