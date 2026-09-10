/**
 * MongoDB connection (design system plan, Section 6.4). No database
 * convention exists anywhere else in this repo -- this is the first.
 *
 * Requires MONGODB_URI. There is deliberately no fallback to an
 * in-memory or local default: a playground session that looked like it
 * saved but silently didn't would be worse than a clear startup error.
 */
import { MongoClient } from "mongodb";
import type { Db } from "mongodb";

const DB_NAME = "writesea_playground";

let clientPromise: Promise<MongoClient> | undefined;

function getMongoUri(): string {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
        throw new Error("MONGODB_URI is not set. The playground's session/tree persistence requires it -- see apps/docs/lib/playground/README.md.");
    }
    return uri;
}

/**
 * Reused across requests in the same server process (Next.js keeps
 * module state warm between requests in both dev and production) so a
 * connection is opened once, not per request.
 */
export function getMongoClient(): Promise<MongoClient> {
    if (!clientPromise) {
        clientPromise = new MongoClient(getMongoUri()).connect();
    }
    return clientPromise;
}

export async function getDb(): Promise<Db> {
    const client = await getMongoClient();
    return client.db(DB_NAME);
}

/** Test-only: drops the cached client so a fresh MONGODB_URI takes effect. Never called from application code. */
export function resetMongoClientForTests() {
    clientPromise = undefined;
}
