import { loadRegistry } from "@your-job-search-genius/ds-registry";
import { getDb } from "~/lib/playground/db";
import { isPlaygroundEnabled, playgroundDisabledResponse } from "~/lib/playground/feature-flag";
import { createSession, listSessions } from "~/lib/playground/session-store";

export const runtime = "nodejs";

const EMPTY_TREE = { rootId: "root", nodes: { root: { id: "root", kind: "primitive" as const, tag: "div" as const, className: [], children: [] } } };

export async function GET() {
    if (!isPlaygroundEnabled()) return playgroundDisabledResponse();
    const db = await getDb();
    const sessions = await listSessions(db);
    return Response.json({ sessions });
}

export async function POST(request: Request) {
    if (!isPlaygroundEnabled()) return playgroundDisabledResponse();
    const body = await request.json().catch(() => ({}));
    const title = typeof body?.title === "string" ? body.title : undefined;

    const registry = loadRegistry();
    const db = await getDb();
    const { session, treeVersion } = await createSession(db, {
        libraryVersion: registry.version,
        registryVersion: registry.version,
        initialTree: EMPTY_TREE,
        title,
    });
    return Response.json({ session, treeVersion }, { status: 201 });
}
