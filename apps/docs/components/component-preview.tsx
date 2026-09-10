import type { ComponentType } from "react";
import { highlight } from "fumadocs-core/highlight";
import { CodeBlock, Pre } from "fumadocs-ui/components/codeblock";
import { Tab, Tabs } from "fumadocs-ui/components/tabs";
import { demoRegistry } from "~/lib/demo-registry";
import { getDemoSource } from "~/lib/demo-sources";
import { PreviewErrorBoundary } from "./preview-error-boundary";
import { PreviewFrame } from "./preview-frame";

interface ComponentPreviewProps {
    /** Registry id, e.g. "base/buttons/buttons" -- matches the component's path under components/, without the .demo/.story suffix. */
    demo: string;
    /** Named export from that demo/story file to render, e.g. "Primary". */
    export: string;
    /** Layout hint for the preview frame. */
    align?: "center" | "start";
    /** Confines `position: fixed` descendants (e.g. an always-mounted fixed sidebar shell) to the preview frame instead of the real viewport. See PreviewFrame. */
    contain?: boolean;
}

/**
 * Live-renders a real example straight from the library's actual
 * *.demo.tsx (or *.story.tsx fallback) file, with a "Code" tab showing
 * its exact source -- both generated at build time by
 * apps/docs/scripts/sync-content.ts, so there is zero drift between what
 * is documented and what the component actually does.
 */
export async function ComponentPreview({ demo, export: exportName, align = "center", contain = false }: ComponentPreviewProps) {
    const module = demoRegistry[demo];
    if (!module) {
        throw new Error(`[ComponentPreview] unknown demo id "${demo}". Run \`pnpm run docs:sync\` and check components/**/*.demo.tsx.`);
    }

    const Demo = module[exportName] as ComponentType<Record<string, never>> | undefined;
    if (!Demo) {
        throw new Error(`[ComponentPreview] demo "${demo}" has no export "${exportName}".`);
    }

    const code = getDemoSource(demo, exportName);
    const highlighted = code
        ? await highlight(code, {
              lang: "tsx",
              themes: { light: "github-light", dark: "github-dark" },
              components: {
                  pre: (props) => (
                      <CodeBlock {...props}>
                          <Pre>{props.children}</Pre>
                      </CodeBlock>
                  ),
              },
          })
        : null;

    return (
        <Tabs items={["Preview", "Code"]} className="my-6">
            <Tab value="Preview">
                <PreviewFrame align={align} contain={contain}>
                    <PreviewErrorBoundary label={`${demo}#${exportName}`}>
                        <Demo />
                    </PreviewErrorBoundary>
                </PreviewFrame>
            </Tab>
            <Tab value="Code">
                {highlighted ?? (
                    <p className="text-sm text-tertiary">
                        Source unavailable -- run <code>pnpm run docs:sync</code>.
                    </p>
                )}
            </Tab>
        </Tabs>
    );
}
