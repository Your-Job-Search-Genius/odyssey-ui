/**
 * Drives the real McpServer end to end over an in-process transport pair
 * (no subprocess needed) -- exercises the actual MCP request/response
 * path, not just the underlying tool functions directly, so a mistake in
 * how a tool is registered (wrong schema, wrong return shape) would fail
 * here even if the tool's own logic is correct in isolation.
 */
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { loadRegistry } from "@your-job-search-genius/ds-registry";
import type { Registry } from "@your-job-search-genius/ds-registry";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { createServer } from "../src/server.js";

let registry: Registry;
let server: McpServer;
let client: Client;

beforeEach(async () => {
    registry = loadRegistry();
    server = createServer(registry);
    client = new Client({ name: "test-client", version: "0.0.0" });
    const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();
    await Promise.all([client.connect(clientTransport), server.connect(serverTransport)]);
});

afterEach(async () => {
    await client.close();
    await server.close();
});

function textOf(result: Awaited<ReturnType<Client["callTool"]>>): string {
    const content = result.content as Array<{ type: string; text?: string }>;
    const first = content[0];
    if (!first || first.type !== "text" || typeof first.text !== "string") throw new Error("expected a text content block");
    return first.text;
}

describe("MCP server: tools", () => {
    it("lists all 9 tools", async () => {
        const { tools } = await client.listTools();
        expect(tools.map((t) => t.name).sort()).toEqual(
            [
                "get_component",
                "get_example",
                "get_rules",
                "get_tokens",
                "list_components",
                "search_components",
                "search_icons",
                "suggest_composition",
                "validate_jsx",
            ].sort(),
        );
    });

    it("get_rules returns markdown mentioning the allowed primitives", async () => {
        const result = await client.callTool({ name: "get_rules", arguments: {} });
        const md = textOf(result);
        expect(md).toContain("div");
        expect(md).toContain("Forbidden elements");
    });

    it("list_components filters by category", async () => {
        const result = await client.callTool({ name: "list_components", arguments: { category: "base" } });
        const list = JSON.parse(textOf(result));
        expect(list.length).toBeGreaterThan(0);
        expect(list.every((c: { category: string }) => c.category === "base")).toBe(true);
    });

    it("get_component returns the full Button entry", async () => {
        const result = await client.callTool({ name: "get_component", arguments: { name: "base/buttons/button" } });
        const entry = JSON.parse(textOf(result));
        expect(entry.name).toBe("Button");
        expect(entry.props.length).toBeGreaterThan(0);
    });

    it("get_component reports not-found for an unknown name, rather than throwing", async () => {
        const result = await client.callTool({ name: "get_component", arguments: { name: "definitely-not-a-component" } });
        expect(JSON.parse(textOf(result)).found).toBe(false);
    });

    it("search_components ranks a relevant match for 'button'", async () => {
        const result = await client.callTool({ name: "search_components", arguments: { intent: "a button to submit a form" } });
        const matches = JSON.parse(textOf(result));
        expect(matches.some((m: { name: string }) => m.name === "Button")).toBe(true);
    });

    it("get_tokens can be scoped to one group", async () => {
        const result = await client.callTool({ name: "get_tokens", arguments: { group: "colors" } });
        const colors = JSON.parse(textOf(result));
        expect(Array.isArray(colors)).toBe(true);
        expect(colors.length).toBeGreaterThan(0);
    });

    it("search_icons finds a known icon", async () => {
        const result = await client.callTool({ name: "search_icons", arguments: { query: "activity" } });
        const payload = JSON.parse(textOf(result));
        expect(payload.found).toBe(true);
        expect(payload.icons.some((i: { name: string }) => i.name === "Activity")).toBe(true);
    });

    it("search_icons never invents an icon for a nonsense query", async () => {
        const result = await client.callTool({ name: "search_icons", arguments: { query: "zzzznotarealiconzzzz" } });
        const payload = JSON.parse(textOf(result));
        expect(payload.found).toBe(false);
        expect(Array.isArray(payload.suggestions)).toBe(true);
    });

    it("validate_jsx round-trips through the real tool call", async () => {
        const result = await client.callTool({
            name: "validate_jsx",
            arguments: {
                code: 'import { Button } from "@your-job-search-genius/odyssey-ui/components/base/buttons/button";\nconst X = () => <Button>Save</Button>;',
            },
        });
        expect(JSON.parse(textOf(result)).ok).toBe(true);
    });

    it("get_example returns a curated example for Button", async () => {
        const result = await client.callTool({ name: "get_example", arguments: { name: "base/buttons/button" } });
        const example = JSON.parse(textOf(result));
        expect(example.code).toContain("Button");
    });

    it("suggest_composition returns a recipe mentioning relevant components", async () => {
        const result = await client.callTool({ name: "suggest_composition", arguments: { intent: "a button" } });
        const payload = JSON.parse(textOf(result));
        expect(payload.components.length).toBeGreaterThan(0);
    });
});

describe("MCP server: resources", () => {
    it("lists the static ds:// resources plus every component", async () => {
        const { resources } = await client.listResources();
        const uris = resources.map((r) => r.uri);
        expect(uris).toContain("ds://registry");
        expect(uris).toContain("ds://rules");
        expect(uris).toContain("ds://tokens");
        expect(uris).toContain("ds://component/base/buttons/button");
    });

    it("reads ds://rules as markdown", async () => {
        const result = await client.readResource({ uri: "ds://rules" });
        expect(result.contents[0]?.mimeType).toBe("text/markdown");
    });

    it("reads a single component resource by template", async () => {
        const result = await client.readResource({ uri: "ds://component/base/buttons/button" });
        const parsed = JSON.parse(result.contents[0]?.text as string);
        expect(parsed.name).toBe("Button");
    });
});

describe("MCP server: prompts", () => {
    it("exposes the build-ui prompt and fills in the description argument", async () => {
        const { prompts } = await client.listPrompts();
        expect(prompts.map((p) => p.name)).toContain("build-ui");

        const result = await client.getPrompt({ name: "build-ui", arguments: { description: "a login form" } });
        const message = result.messages[0];
        expect(message?.content.type).toBe("text");
        expect((message?.content as { text: string }).text).toContain("a login form");
        expect((message?.content as { text: string }).text).toContain("get_rules");
    });
});
