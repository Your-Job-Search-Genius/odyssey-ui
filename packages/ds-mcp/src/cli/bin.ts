#!/usr/bin/env node
/**
 * `npx @your-job-search-genius/ds-mcp` entry point.
 * - bare `ds-mcp`: stdio transport, for Claude Code / Claude Desktop /
 *   Cursor spawning a local process.
 * - `ds-mcp serve`: standalone Streamable HTTP server (see serve.ts),
 *   for remote deployments that claude.ai / ChatGPT web connectors can
 *   reach over HTTPS. PORT (default 3002), HOST (default 0.0.0.0).
 * - `ds-mcp init`: writes the consuming repo's MCP config (see init.ts)
 *   and exits without starting a server.
 */
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { createRefreshableRegistryHolder, startRegistryAutoRefresh } from "../registry-holder.js";
import type { RegistryHolder } from "../registry-holder.js";
import { SERVER_NAME, createServer, resolveRegistry, warnOnLibraryVersionMismatch } from "../server.js";
import { runInit } from "./init.js";
import { startHttpServer, stopOnSignals } from "./serve.js";

const DEFAULT_REFRESH_MS = 5 * 60 * 1000;

/** Loads the registry and wires up DS_REGISTRY_URL hot reload -- shared by both long-lived transports (stdio and serve). */
async function createHolder(): Promise<RegistryHolder> {
    const registry = await resolveRegistry();
    warnOnLibraryVersionMismatch(registry);

    // Hot reload (design system plan, Section 8): only meaningful with
    // DS_REGISTRY_URL set -- there is nothing to re-fetch for the
    // bundled default, and both transports are long-lived processes, so
    // picking up a fresher registry without a restart is worth polling.
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
    return holder;
}

async function main() {
    const [subcommand] = process.argv.slice(2);

    if (subcommand === "init") {
        await runInit(process.cwd());
        return;
    }

    if (subcommand === "serve") {
        const port = Number(process.env.PORT) || 3002;
        const host = process.env.HOST || "0.0.0.0";
        const holder = await createHolder();
        const server = await startHttpServer(holder, { port, host });
        stopOnSignals(server);
        console.error(`[${SERVER_NAME}] Streamable HTTP server listening on http://${host}:${port}/mcp (health: /healthz).`);
        return;
    }

    if (subcommand !== undefined) {
        console.error(`[${SERVER_NAME}] Unknown subcommand "${subcommand}". Usage: ds-mcp [init|serve] (bare = stdio server).`);
        process.exit(1);
    }

    const holder = await createHolder();
    const server = createServer(holder);
    const transport = new StdioServerTransport();
    await server.connect(transport);
}

main().catch((error) => {
    console.error("[writesea-ds-mcp] fatal error:", error);
    process.exit(1);
});
