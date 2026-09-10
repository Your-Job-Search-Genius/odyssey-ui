/**
 * handleMcpWebRequest is what apps/docs's /api/mcp Next.js route calls
 * directly -- a real Web Standard Request/Response round-trip here is
 * what actually exercises that integration, since server.test.ts only
 * drives the server over an in-memory transport, not real HTTP.
 */
import { loadRegistry } from "@your-job-search-genius/ds-registry";
import { describe, expect, it } from "vitest";
import { handleMcpWebRequest } from "../src/http.js";

function jsonRpcRequest(body: Record<string, unknown>): Request {
    return new Request("http://localhost/api/mcp", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json, text/event-stream" },
        body: JSON.stringify(body),
    });
}

describe("handleMcpWebRequest", () => {
    const registry = loadRegistry();

    it("responds to a real initialize request over Web Standard Request/Response", async () => {
        const response = await handleMcpWebRequest(
            registry,
            jsonRpcRequest({
                jsonrpc: "2.0",
                id: 1,
                method: "initialize",
                params: { protocolVersion: "2025-06-18", capabilities: {}, clientInfo: { name: "test", version: "0.0.0" } },
            }),
        );

        expect(response.status).toBe(200);
        const contentType = response.headers.get("content-type") ?? "";
        const raw = await response.text();
        // The transport may reply as plain JSON or as a one-shot SSE frame
        // depending on the Accept header negotiation -- parse whichever it is.
        const payload = contentType.includes("event-stream")
            ? JSON.parse(
                  raw
                      .split("\n")
                      .find((l) => l.startsWith("data:"))
                      ?.slice("data:".length) ?? "{}",
              )
            : JSON.parse(raw);
        expect(payload.result?.serverInfo?.name).toBe("writesea-ds-mcp");
    });

    it("rejects a malformed request without throwing", async () => {
        const response = await handleMcpWebRequest(registry, new Request("http://localhost/api/mcp", { method: "POST", body: "not json" }));
        expect(response.status).toBeGreaterThanOrEqual(400);
    });
});
