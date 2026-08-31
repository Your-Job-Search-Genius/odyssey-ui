import { Link as AriaLink } from "react-aria-components";
import type { LinkProps } from "react-aria-components";
import "./Link.css";

export type { LinkProps };

/**
 * Not in the source Figma file. Built directly on `react-aria-components`'
 * `Link` — the same primitive `Breadcrumb` already composes for each crumb —
 * extracted here as its own standalone, in-flow text link. Renders a real
 * `<a>` when given an `href` (native browser navigation, works without JS);
 * without one it renders a `<span role="link">` driven entirely by `onPress`.
 */
export function Link({ className, ...props }: LinkProps) {
  return <AriaLink {...props} className={className ? `wsu-Link ${className}` : "wsu-Link"} />;
}
