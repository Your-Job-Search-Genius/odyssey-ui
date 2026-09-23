import { getDb } from "~/lib/playground/db";
import { isPlaygroundEnabled, playgroundDisabledResponse } from "~/lib/playground/feature-flag";
import { getSession, listMessages, listTreeVersions } from "~/lib/playground/session-store";

export const runtime = "nodejs";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
    if (!isPlaygroundEnabled()) return playgroundDisabledResponse();
    const { id } = await params;
    const db = await getDb();
    const session = await getSession(db, id);
    if (!session) return Response.json({ error: `Session "${id}" does not exist.` }, { status: 404 });

    const [messages, treeVersions] = await Promise.all([listMessages(db, id), listTreeVersions(db, id)]);
    return Response.json({ session, messages, treeVersions });
}
