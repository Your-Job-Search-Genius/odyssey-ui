import { DropZone as AriaDropZone, Text } from "react-aria-components";
import type { DropZoneProps } from "react-aria-components";
import "./DropZone.css";

export type { DropZoneProps };
export { Text };

/**
 * No Figma source (not present in design-inventory.md, same as Breadcrumbs
 * and TagGroup). Thin wrapper around `react-aria-components`' `DropZone` —
 * an area that accepts drag-and-drop content. Drag-and-drop should never be
 * the only way in (WCAG 2.1.1, 2.5.1); pair this with a `FileTrigger`/
 * `Button` child for a keyboard- and touch-reachable fallback, as
 * `FileInput` does.
 */
export function DropZone({ className, ...props }: DropZoneProps) {
  return <AriaDropZone {...props} className={className ? `wsu-DropZone ${className}` : "wsu-DropZone"} />;
}
