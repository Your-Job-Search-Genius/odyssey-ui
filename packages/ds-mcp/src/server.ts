/**
 * Assembles the McpServer: registers every tool, resource, and prompt
 * against one Registry instance. Transport-agnostic -- cli/bin.ts wires
 * this to stdio, http.ts wires it to Streamable HTTP; both share this
 * exact tool/resource/prompt set.
 */
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { RegistrySchema, loadRegistry } from "@your-job-search-genius/ds-registry";
import type { Registry } from "@your-job-search-genius/ds-registry";
import fs from "node:fs";
import path from "node:path";
import { registerPrompts } from "./prompts.js";
import { toRegistryHolder } from "./registry-holder.js";
import type { RegistryHolder } from "./registry-holder.js";
import { registerResources } from "./resources.js";
import { registerTools } from "./tools.js";

export const SERVER_NAME = "writesea-ds-mcp";
export const SERVER_VERSION = "0.5.0";

/**
 * Sent to clients at initialize; most MCP clients put this in the agent's
 * system prompt. It is the strongest lever an MCP server has to make the
 * guidelines workflow the default path (it cannot technically force it).
 */
export const SERVER_INSTRUCTIONS = [
    "Writesea Odyssey design system. For ANY request that produces UI (page, screen, form, component, layout), this workflow is mandatory:",
    "1. Call get_rules, then plan_ui_task with the user's request. Fill in its plan before writing code.",
    "2. Discover components with list_components / search_components / get_component; use only library components and icons. Never invent components, props, or icons.",
    "3. Build with the plan's rules in view (Color contrast and Screen readers (NVDA) always apply).",
    "4. Re-check every rule ID in the plan's completion record; fix failures.",
    "5. Call validate_jsx, then run the project's type-check/build and fix errors.",
    "6. Finish with the filled completion record. Anything not actually verified is Not verified, never Pass.",
].join("\n");

/**
 * Loads the registry to serve. If DS_REGISTRY_URL is set, fetches and
 * validates that instead of the bundled copy, falling back to the
 * bundled one (never crashing the server) if the fetch or validation
 * fails -- exactly the "bundled as fallback" behavior the plan asks for.
 */
export async function resolveRegistry(env: NodeJS.ProcessEnv = process.env): Promise<Registry> {
    const url = env.DS_REGISTRY_URL;
    if (!url) return loadRegistry();

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const raw = await response.json();
        const parsed = RegistrySchema.safeParse(raw);
        if (!parsed.success) throw new Error(`schema validation failed: ${parsed.error.message}`);
        return parsed.data;
    } catch (error) {
        console.error(`[${SERVER_NAME}] DS_REGISTRY_URL="${url}" failed (${String(error)}), falling back to the bundled registry.`);
        return loadRegistry();
    }
}

/**
 * Warns (does not fail) when the consuming repo's installed
 * @your-job-search-genius/odyssey-ui version differs from the version
 * this registry was built from -- the two can drift when a project
 * upgrades the library without also upgrading ds-mcp.
 */
export function warnOnLibraryVersionMismatch(registry: Registry, cwd: string = process.cwd()) {
    const pkgPath = path.join(cwd, "node_modules", "@your-job-search-genius", "odyssey-ui", "package.json");
    if (!fs.existsSync(pkgPath)) return; // not installed alongside the consumer, or run from elsewhere -- nothing to compare
    try {
        const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8")) as { version?: string };
        if (pkg.version && pkg.version !== registry.version) {
            console.error(
                `[${SERVER_NAME}] Warning: this registry was built from @your-job-search-genius/odyssey-ui@${registry.version}, but ${pkg.version} is installed. Some components/props may be out of date. Consider updating ${SERVER_NAME} or setting DS_REGISTRY_URL to a freshly built registry.`,
            );
        }
    } catch {
        // Malformed package.json in node_modules is not this server's problem to fail on.
    }
}

/**
 * Accepts either a plain Registry (the common case -- wrapped in a
 * holder that always returns the same value) or an already-constructed
 * RegistryHolder (the hot-reload case -- see registry-holder.ts and
 * cli/bin.ts's use of createRefreshableRegistryHolder +
 * startRegistryAutoRefresh). Every tool/resource reads through
 * registryHolder.get() at call time either way.
 */
export function createServer(registryOrHolder: Registry | RegistryHolder): McpServer {
    const registryHolder = toRegistryHolder(registryOrHolder);
    const server = new McpServer({ name: SERVER_NAME, version: SERVER_VERSION }, { instructions: SERVER_INSTRUCTIONS });
    registerTools(server, registryHolder);
    registerResources(server, registryHolder);
    registerPrompts(server);
    return server;
}
