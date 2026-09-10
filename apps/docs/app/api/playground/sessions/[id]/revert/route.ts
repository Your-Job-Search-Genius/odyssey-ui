import { z } from "zod";
import { getDb } from "~/lib/playground/db";
import { isPlaygroundEnabled, playgroundDisabledResponse } from "~/lib/playground/feature-flag";
import { revertToVersion } from "~/lib/playground/session-store";

export const runtime = "nodejs";

const BodySchema = z.object({ version: z.number().int().nonnegative() });

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
    if (!isPlaygroundEnabled()) return playgroundDisabledResponse();
    const { id } = await params;
    const parsed = BodySchema.safeParse(await request.json().catch(() => null));
    if (!parsed.success) return Response.json({ error: parsed.error.message }, { status: 400 });

    try {
        const treeVersion = await revertToVersion(await getDb(), id, parsed.data.version);
        return Response.json({ treeVersion });
    } catch (error) {
        return Response.json({ error: error instanceof Error ? error.message : String(error) }, { status: 400 });
    }
}
