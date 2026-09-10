import type { ComponentType } from "react";

export type PlaygroundControl =
    | { prop: string; label?: string; type: "select"; options: string[] }
    | { prop: string; label?: string; type: "boolean" }
    | { prop: string; label?: string; type: "text" };

export interface PlaygroundSchema {
    /** The real component being controlled. */
    // biome-ignore-next-line -- intentionally loose: playgrounds cover many unrelated prop shapes
    component: ComponentType<any>;
    /** Display name used when generating the live JSX snippet, e.g. "Button". */
    componentName: string;
    /** Seed values, one per control (and, if set, `childrenProp`). */
    defaultProps: Record<string, unknown>;
    controls: PlaygroundControl[];
    /** Prop that renders as the element's text children (e.g. "children"). Omit for components with no text content. */
    childrenProp?: string;
}
