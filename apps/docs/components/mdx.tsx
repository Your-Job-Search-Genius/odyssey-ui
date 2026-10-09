import defaultMdxComponents from "fumadocs-ui/mdx";
import type { MDXComponents } from "mdx/types";
import { ComponentPlayground } from "./component-playground";
import { ComponentPreview } from "./component-preview";
import { IconGallery } from "./icon-gallery";
import { PropsTable } from "./props-table";
import { DocsCallout, DocsPre, DocsTab, DocsTabs } from "./site/docs-mdx";

/** Registers every component available for use inside content/docs/**\/*.mdx, styled as the "Spatial Layers" article. */
export function getMDXComponents(components?: MDXComponents): MDXComponents {
    return {
        ...defaultMdxComponents,
        // Plain headings (ids kept for the TOC and anchor links), as in the approved mockup.
        h2: (props) => <h2 {...props} />,
        h3: (props) => <h3 {...props} />,
        h4: (props) => <h4 {...props} />,
        pre: DocsPre,
        table: (props) => (
            <div className="sp-table-wrap">
                <table className="sp-table" {...props} />
            </div>
        ),
        Callout: DocsCallout,
        Tab: DocsTab,
        Tabs: DocsTabs,
        ComponentPreview,
        ComponentPlayground,
        PropsTable,
        IconGallery,
        ...components,
    };
}
