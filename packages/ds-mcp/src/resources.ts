/**
 * The ds:// resources from the plan (Section 4.3): the same data the
 * tools expose, but addressable/subscribable as MCP resources for
 * clients that prefer that model. Reads through a RegistryHolder (see
 * registry-holder.ts) rather than a captured Registry value, so these
 * stay live if the holder is later refreshed -- same reasoning as
 * tools.ts's registerTools.
 */
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { RegistryHolder } from "./registry-holder.js";
import { rulesToMarkdown } from "./tools.js";

function json(uri: string, value: unknown) {
    return { contents: [{ uri, mimeType: "application/json", text: JSON.stringify(value, null, 2) }] };
}

export function registerResources(server: McpServer, registryHolder: RegistryHolder) {
    server.registerResource(
        "registry",
        "ds://registry",
        { title: "Full registry", description: "The complete registry: components, tokens, icons, rules.", mimeType: "application/json" },
        async (uri) => json(uri.href, registryHolder.get()),
    );

    server.registerResource(
        "rules",
        "ds://rules",
        { title: "Agent rules", description: "The hard constraints, as markdown.", mimeType: "text/markdown" },
        async (uri) => ({
            contents: [{ uri: uri.href, mimeType: "text/markdown", text: rulesToMarkdown(registryHolder.get()) }],
        }),
    );

    server.registerResource(
        "tokens",
        "ds://tokens",
        {
            title: "Design tokens",
            description: "Colors, breakpoints, shadows, animations, radius, and the validator's allowed Tailwind patterns.",
            mimeType: "application/json",
        },
        async (uri) => json(uri.href, registryHolder.get().tokens),
    );

    server.registerResource(
        "component",
        new ResourceTemplate("ds://component/{+name}", {
            list: async () => ({
                resources: registryHolder.get().components.map((c) => ({ uri: `ds://component/${c.id}`, name: c.name, description: c.description })),
            }),
        }),
        { title: "Single component", description: "One component's full registry entry, addressed by id, name, or importName." },
        async (uri, variables) => {
            const name = Array.isArray(variables.name) ? variables.name[0] : variables.name;
            const entry = registryHolder.get().components.find((c) => c.id === name || c.name === name || c.importName === name);
            if (!entry) {
                return {
                    contents: [
                        { uri: uri.href, mimeType: "application/json", text: JSON.stringify({ found: false, message: `No component matches "${name}".` }) },
                    ],
                };
            }
            return json(uri.href, entry);
        },
    );
}
