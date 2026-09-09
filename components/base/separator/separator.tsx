"use client";

import type { ReactNode } from "react";
import type { SeparatorProps as AriaSeparatorProps } from "react-aria-components";
import { Separator as AriaSeparator } from "react-aria-components";
import { cx, sortCx } from "@/utils/cx";

const styles = sortCx({
    line: "shrink-0 bg-border-secondary",
    orientations: {
        horizontal: "h-px w-full",
        vertical: "h-full w-px",
    },
});

export interface SeparatorProps extends AriaSeparatorProps {
    /**
     * Text or node rendered in the middle of the separator (e.g. "OR"). Only supported for
     * horizontal orientation — a labeled vertical separator has no established visual pattern,
     * so `children` is ignored when `orientation="vertical"`.
     */
    children?: ReactNode;
    className?: string;
}

/**
 * A line (or labeled line) used to visually and semantically separate content.
 *
 * Renders the native `role="separator"` semantics via React Aria. Pass `elementType="div"`
 * (inherited from `AriaSeparatorProps`) if you need a purely decorative separator with no
 * accessibility semantics at all — e.g. inside a component that already has its own
 * accessible structure and the line is redundant to assistive tech.
 */
export const Separator = ({ orientation = "horizontal", children, className, ...props }: SeparatorProps) => {
    // Labeled variant: two line segments with text in the middle. Rendered manually (rather than
    // via `AriaSeparator`) since the label needs to sit visually inline between two children.
    if (children && orientation === "horizontal") {
        return (
            <div role="separator" aria-orientation="horizontal" className={cx("flex w-full items-center gap-3", className)}>
                <span aria-hidden="true" className="h-px min-w-4 flex-1 bg-border-secondary" />
                <span className="shrink-0 text-sm font-medium text-tertiary">{children}</span>
                <span aria-hidden="true" className="h-px min-w-4 flex-1 bg-border-secondary" />
            </div>
        );
    }

    return <AriaSeparator orientation={orientation} {...props} className={cx(styles.line, styles.orientations[orientation], className)} />;
};
