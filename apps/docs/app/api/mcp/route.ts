/**
 * Mounts @your-job-search-genius/ds-mcp's Streamable HTTP transport
 * (design system plan, Section 4.1) so any external MCP client can
 * connect to this docs site's registry directly, separate from the
 * playground's own in-process agent loop (see lib/playground/agent.ts's
 * doc comment for why the playground itself doesn't route through here).
 */
import { handleMcpWebRequest } from "@your-job-search-genius/ds-mcp";
import { loadRegistry } from "@your-job-search-genius/ds-registry";

export const runtime = "nodejs";

export async function POST(request: Request) {
    return handleMcpWebRequest(loadRegistry(), request);
}

export async function GET(request: Request) {
    return handleMcpWebRequest(loadRegistry(), request);
}

export async function DELETE(request: Request) {
    return handleMcpWebRequest(loadRegistry(), request);
}
