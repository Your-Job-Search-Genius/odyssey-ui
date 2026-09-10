#!/usr/bin/env node
/**
 * `npx @your-job-search-genius/ds-mcp` entry point: stdio transport, for
 * Claude Code and Cursor. A bare `ds-mcp` (no subcommand) starts the
 * server; `ds-mcp init` writes the consuming repo's MCP config instead
 * (see init.ts) and exits without starting a server.
 */
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { createRefreshableRegistryHolder, startRegistryAutoRefresh } from "../registry-holder.js";
import { SERVER_NAME, createServer, resolveRegistry, warnOnLibraryVersionMismatch } from "../server.js";
import { runInit } from "./init.js";

const DEFAULT_REFRESH_MS = 5 * 60 * 1000;

async function main() {
    const [subcommand] = process.argv.slice(2);

    if (subcommand === "init") {
        await runInit(process.cwd());
        return;
    }

    const registry = await resolveRegistry();
    warnOnLibraryVersionMismatch(registry);

    // Hot reload (design system plan, Section 8): only meaningful with
    // DS_REGISTRY_URL set -- there is nothing to re-fetch for the
    // bundled default, and this is a long-lived stdio process (the
    // editor stays connected for the whole session), so picking up a
    // fresher registry without a restart is worth the polling.
    const registryUrl = process.env.DS_REGISTRY_URL;
    const holder = createRefreshableRegistryHolder(registry);
    if (registryUrl) {
        const intervalMs = Number(process.env.DS_REGISTRY_REFRESH_MS) || DEFAULT_REFRESH_MS;
        startRegistryAutoRefresh(holder, {
            url: registryUrl,
            intervalMs,
            onRefreshed: (fresh) => console.error(`[${SERVER_NAME}] registry refreshed from ${registryUrl} (version ${fresh.version}).`),
            onError: (error) =>
                console.error(`[${SERVER_NAME}] registry auto-refresh from ${registryUrl} failed, keeping the last-known-good registry: ${String(error)}`),
        });
    }

    const server = createServer(holder);
    const transport = new StdioServerTransport();
    await server.connect(transport);
}

main().catch((error) => {
    console.error("[writesea-ds-mcp] fatal error:", error);
    process.exit(1);
});
