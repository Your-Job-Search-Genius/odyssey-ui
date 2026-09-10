import { loadRegistry } from "@your-job-search-genius/ds-registry";
import { notFound } from "next/navigation";
import { getDb } from "~/lib/playground/db";
import { isPlaygroundEnabled } from "~/lib/playground/feature-flag";
import { getSession, listMessages, listTreeVersions } from "~/lib/playground/session-store";
import { PlaygroundClient } from "./playground-client";

export const dynamic = "force-dynamic";

export default async function PlaygroundSessionPage({ params }: { params: Promise<{ sessionId: string }> }) {
    if (!isPlaygroundEnabled()) notFound();
    const { sessionId } = await params;
    const db = await getDb();
    const session = await getSession(db, sessionId);
    if (!session) notFound();

    const [messages, treeVersions] = await Promise.all([listMessages(db, sessionId), listTreeVersions(db, sessionId)]);
    const registry = loadRegistry();

    return (
        <PlaygroundClient
            sessionId={sessionId}
            initialSession={session}
            initialMessages={messages}
            initialTree={treeVersions.at(-1)?.tree ?? { rootId: "root", nodes: {} }}
            initialVersions={treeVersions.map((v) => ({ version: v.version, summary: v.summary, createdAt: v.createdAt }))}
            ruleSetVersion={registry.rules.version}
        />
    );
}
