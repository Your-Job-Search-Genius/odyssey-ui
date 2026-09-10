/**
 * `ds-mcp serve`: standalone Streamable HTTP deployment of the MCP
 * server, for clients that can only reach a remote HTTPS URL (claude.ai
 * web connectors, ChatGPT developer-mode connectors) -- unlike the
 * stdio transport, which needs the client to spawn a local process.
 *
 * Deliberately a plain node:http server, no framework: the MCP SDK's
 * StreamableHTTPServerTransport already speaks IncomingMessage/
 * ServerResponse (see http.ts's handleMcpNodeRequest), so Express et al
 * would add a dependency for exactly one route.
 *
 * Endpoints:
 * - POST/GET/DELETE <path> (default /mcp): the MCP endpoint. Also served
 *   at / so `https://host` pasted straight into a connector UI works.
 * - GET /healthz: liveness probe for the hosting platform.
 */
import http from "node:http";
import { handleMcpNodeRequest } from "../http.js";
import type { RegistryHolder } from "../registry-holder.js";
import { SERVER_NAME } from "../server.js";

export interface ServeOptions {
    port: number;
    host?: string;
    /** URL path of the MCP endpoint. "/" is always accepted too. */
    path?: string;
}

/** Starts the HTTP server and resolves once it is listening. Reads the registry through the holder on every request, so DS_REGISTRY_URL auto-refresh (wired up in bin.ts) is picked up without a restart. */
export function startHttpServer(holder: RegistryHolder, options: ServeOptions): Promise<http.Server> {
    const mcpPath = options.path ?? "/mcp";

    const server = http.createServer((req, res) => {
        const url = new URL(req.url ?? "/", "http://localhost");

        if (req.method === "GET" && url.pathname === "/healthz") {
            const registry = holder.get();
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ ok: true, name: SERVER_NAME, registryVersion: registry.version }));
            return;
        }

        if (url.pathname === mcpPath || url.pathname === "/") {
            handleMcpNodeRequest(holder.get(), req, res).catch((error) => {
                console.error(`[${SERVER_NAME}] request failed:`, error);
                if (!res.headersSent) {
                    res.writeHead(500, { "Content-Type": "application/json" });
                    res.end(JSON.stringify({ jsonrpc: "2.0", error: { code: -32603, message: "Internal server error" }, id: null }));
                } else {
                    res.end();
                }
            });
            return;
        }

        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: `Not found. The MCP endpoint is ${mcpPath} (or /); health check is /healthz.` }));
    });

    return new Promise((resolve, reject) => {
        server.once("error", reject);
        server.listen(options.port, options.host, () => {
            server.off("error", reject);
            resolve(server);
        });
    });
}

/** Wires SIGINT/SIGTERM to a graceful close so hosting platforms' rolling deploys don't cut open responses off mid-stream. */
export function stopOnSignals(server: http.Server): void {
    for (const signal of ["SIGINT", "SIGTERM"] as const) {
        process.on(signal, () => {
            console.error(`[${SERVER_NAME}] ${signal} received, shutting down.`);
            server.close(() => process.exit(0));
            // A stuck open connection must not block shutdown forever.
            setTimeout(() => process.exit(0), 5_000).unref();
        });
    }
}
