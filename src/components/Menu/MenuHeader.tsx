import type { ReactNode } from "react";

export interface MenuHeaderProps {
  /** Initials shown in the square avatar when no `avatar` node is given. */
  initials?: string;
  /** A custom avatar (an `<img>`, say) replacing the initials square. */
  avatar?: ReactNode;
  name: ReactNode;
  /** Secondary line — an email address in the file's User Menu. */
  detail?: ReactNode;
}

/**
 * MenuHeader — the "Menu Headers / User Profile" component from Figma's
 * Dropdown page (node 433:9118), sitting above the rule at the top of the
 * User Menu (433:9139). Pass it to `<Menu header={...} />`.
 *
 * It renders as plain text and an image: the block sits outside the `menu`
 * element so it never joins the item collection, and nothing inside it is
 * focusable, because a focusable node there would be unreachable by the
 * menu's own arrow-key navigation.
 */
export function MenuHeader({ initials, avatar, name, detail }: MenuHeaderProps) {
  return (
    <>
      {avatar ?? (
        <span className="wsu-MenuHeader__avatar" aria-hidden="true">
          {initials}
        </span>
      )}
      <span className="wsu-MenuHeader__text">
        <span className="wsu-MenuHeader__name">{name}</span>
        {detail ? <span className="wsu-MenuHeader__detail">{detail}</span> : null}
      </span>
    </>
  );
}
