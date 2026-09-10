import type { ReactNode } from "react";
import { DocsLayout } from "fumadocs-ui/layouts/docs";
import { baseOptions } from "~/lib/layout.shared";
import { source } from "~/lib/source";

export default function Layout({ children }: { children: ReactNode }) {
    return (
        <DocsLayout
            tree={source.getPageTree()}
            {...baseOptions()}
            sidebar={{
                defaultOpenLevel: 99,
                // Two sidebar tabs: the component documentation tree, and the
                // MCP guides (content/docs/mcp is a root folder, so its tree
                // is shown alone while browsing it).
                tabs: [
                    { title: "Components", description: "Component library documentation", url: "/docs" },
                    { title: "MCP", description: "Connect AI assistants to the design system", url: "/docs/mcp" },
                ],
            }}
        >
            {children}
        </DocsLayout>
    );
}
