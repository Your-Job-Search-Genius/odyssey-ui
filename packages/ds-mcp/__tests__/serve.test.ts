/**
 * Drives `ds-mcp serve`'s HTTP server (src/cli/serve.ts) over real TCP:
 * an ephemeral-port listen, a real MCP initialize round-trip, the
 * health check, and the 404 fallback -- the exact surface a remote
 * connector (claude.ai / ChatGPT) exercises.
 */
import { loadRegistry } from "@your-job-search-genius/ds-registry";
import type http from "node:http";
import type { AddressInfo } from "node:net";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { startHttpServer } from "../src/cli/serve.js";
import { toRegistryHolder } from "../src/registry-holder.js";

let server: http.Server;
let baseUrl: string;

beforeAll(async () => {
    server = await startHttpServer(toRegistryHolder(loadRegistry()), { port: 0, host: "127.0.0.1" });
    baseUrl = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
});

afterAll(() => {
    server.close();
});

function initializeBody(): string {
    return JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        method: "initialize",
        params: { protocolVersion: "2025-06-18", capabilities: {}, clientInfo: { name: "test", version: "0.0.0" } },
    });
}

async function parseMcpResponse(response: Response): Promise<{ result?: { serverInfo?: { name?: string } } }> {
    const raw = await response.text();
    const contentType = response.headers.get("content-type") ?? "";
    // Same negotiation as http.test.ts: plain JSON or a one-shot SSE frame.
    return contentType.includes("event-stream")
        ? JSON.parse(
              raw
                  .split("\n")
                  .find((l) => l.startsWith("data:"))
                  ?.slice("data:".length) ?? "{}",
          )
        : JSON.parse(raw);
}

describe("ds-mcp serve HTTP server", () => {
    it("answers a real MCP initialize request on /mcp", async () => {
        const response = await fetch(`${baseUrl}/mcp`, {
            method: "POST",
            headers: { "Content-Type": "application/json", Accept: "application/json, text/event-stream" },
            body: initializeBody(),
        });
        expect(response.status).toBe(200);
        const payload = await parseMcpResponse(response);
        expect(payload.result?.serverInfo?.name).toBe("writesea-ds-mcp");
    });

    it("also serves the MCP endpoint at / so a bare host URL works in connector UIs", async () => {
        const response = await fetch(`${baseUrl}/`, {
            method: "POST",
            headers: { "Content-Type": "application/json", Accept: "application/json, text/event-stream" },
            body: initializeBody(),
        });
        expect(response.status).toBe(200);
        const payload = await parseMcpResponse(response);
        expect(payload.result?.serverInfo?.name).toBe("writesea-ds-mcp");
    });

    it("exposes a health check with the registry version", async () => {
        const response = await fetch(`${baseUrl}/healthz`);
        expect(response.status).toBe(200);
        const body = await response.json();
        expect(body.ok).toBe(true);
        expect(typeof body.registryVersion).toBe("string");
    });

    it("404s unknown paths with a hint at the real endpoint", async () => {
        const response = await fetch(`${baseUrl}/nope`);
        expect(response.status).toBe(404);
        const body = await response.json();
        expect(body.error).toContain("/mcp");
    });
});
