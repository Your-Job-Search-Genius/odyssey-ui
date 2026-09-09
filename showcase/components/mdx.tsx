import defaultMdxComponents from "fumadocs-ui/mdx";
import type { MDXComponents } from "mdx/types";
import { ComponentPlayground } from "./component-playground";
import { ComponentPreview } from "./component-preview";
import { IconGallery } from "./icon-gallery";
import { PropsTable } from "./props-table";

/** Registers every component available for use inside content/docs/**\/*.mdx. */
export function getMDXComponents(components?: MDXComponents): MDXComponents {
    return {
        ...defaultMdxComponents,
        ComponentPreview,
        ComponentPlayground,
        PropsTable,
        IconGallery,
        ...components,
    };
}
