import type { ReactNode } from "react";
import { ToggleButton, ToggleButtonGroup } from "@your-job-search-genius/odyssey-ui";
import { SelectionIndicator } from "react-aria-components";

/**
 * `react-aria-components`' `SelectionIndicator` renders an animated pill
 * that slides between items as selection changes, via the library's own
 * shared-element transition instead of a bespoke position calculation. The
 * chrome below is scoped with its own class names (rather than the
 * package's internal `wsu-SegmentedControl*` classes, which aren't part of
 * its public CSS) but targets the package's own stable `.wsu-ToggleButton`
 * output class to strip its default fill/border inside this group.
 */
function SegmentedItem({ id, children }: { id: string; children: ReactNode }) {
  return (
    <ToggleButton id={id}>
      <SelectionIndicator className="docs-SegmentedIndicator" />
      <span className="docs-SegmentedLabel">{children}</span>
    </ToggleButton>
  );
}

export default function ToggleButtonSegmentedControlAnimation() {
  return (
    <>
      <style>{`
        .docs-SegmentedControl {
          padding: 0.1875rem;
          background-color: var(--wsu-color-surface-subtle);
          border-radius: var(--wsu-radius-sm);
        }
        .docs-SegmentedControl .wsu-ToggleButton,
        .docs-SegmentedControl .wsu-ToggleButton[data-selected] {
          position: relative;
          background-color: transparent;
          border-color: transparent;
        }
        .docs-SegmentedControl .wsu-ToggleButton[data-selected] {
          color: var(--wsu-color-text-on-primary);
        }
        .docs-SegmentedLabel {
          position: relative;
          z-index: 1;
        }
        .docs-SegmentedIndicator {
          position: absolute;
          inset: -0.75px;
          z-index: 0;
          border-radius: inherit;
          background-color: var(--wsu-color-primary-bg);
          transition: translate var(--wsu-motion-fast) var(--wsu-motion-easing);
        }
      `}</style>
      <ToggleButtonGroup
        aria-label="Time period"
        className="docs-SegmentedControl"
        selectionMode="single"
        disallowEmptySelection
        defaultSelectedKeys={["day"]}
      >
        <SegmentedItem id="day">Day</SegmentedItem>
        <SegmentedItem id="week">Week</SegmentedItem>
        <SegmentedItem id="month">Month</SegmentedItem>
        <SegmentedItem id="year">Year</SegmentedItem>
      </ToggleButtonGroup>
    </>
  );
}
