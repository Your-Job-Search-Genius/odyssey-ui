/**
 * /playground (design system plan, Section 6.1): creates a fresh
 * session server-side and redirects straight to it -- sessions are
 * anonymous (per this project's decision), so there is no landing state
 * to show before one exists.
 */
import { loadRegistry } from "@your-job-search-genius/ds-registry";
import { notFound, redirect } from "next/navigation";
import { getDb } from "~/lib/playground/db";
import { isPlaygroundEnabled } from "~/lib/playground/feature-flag";
import { createSession } from "~/lib/playground/session-store";

export const dynamic = "force-dynamic";

const EMPTY_TREE = { rootId: "root", nodes: { root: { id: "root", kind: "primitive" as const, tag: "div" as const, className: [], children: [] } } };

export default async function PlaygroundLandingPage() {
    if (!isPlaygroundEnabled()) notFound();
    const registry = loadRegistry();
    const db = await getDb();
    const { session } = await createSession(db, { libraryVersion: registry.version, registryVersion: registry.version, initialTree: EMPTY_TREE });
    redirect(`/playground/${session._id}`);
}
