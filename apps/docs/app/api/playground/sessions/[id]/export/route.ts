/**
 * GET /api/playground/sessions/[id]/export (design system plan, Section
 * 6.1). Returns the current tree's generated .tsx as a file download.
 *
 * Known gap: the plan's open question 8 allowed for an optional zip
 * (the .tsx plus the raw tree JSON, for re-importing a session later).
 * Not built here -- it would need a zip-writing dependency for a
 * secondary nice-to-have, when `?tree=1` already returns the same tree
 * JSON as plain JSON for anyone who wants it programmatically.
 */
import { loadRegistry } from "@your-job-search-genius/ds-registry";
import { treeToTsx } from "@your-job-search-genius/ui-tree";
import { getDb } from "~/lib/playground/db";
import { isPlaygroundEnabled, playgroundDisabledResponse } from "~/lib/playground/feature-flag";
import { getLatestTreeVersion, getSession } from "~/lib/playground/session-store";

export const runtime = "nodejs";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    if (!isPlaygroundEnabled()) return playgroundDisabledResponse();
    const { id } = await params;
    const db = await getDb();
    const session = await getSession(db, id);
    if (!session) return Response.json({ error: `Session "${id}" does not exist.` }, { status: 404 });

    const treeVersion = await getLatestTreeVersion(db, id);
    if (!treeVersion) return Response.json({ error: "No tree version found for this session." }, { status: 500 });

    const url = new URL(request.url);
    if (url.searchParams.get("tree") === "1") {
        return Response.json({ tree: treeVersion.tree, version: treeVersion.version });
    }

    const registry = loadRegistry();
    const code = await treeToTsx(treeVersion.tree, registry, { componentName: "GeneratedComponent" });
    return new Response(code, {
        headers: {
            "Content-Type": "text/plain; charset=utf-8",
            "Content-Disposition": `attachment; filename="${session._id}-v${treeVersion.version}.tsx"`,
        },
    });
}
