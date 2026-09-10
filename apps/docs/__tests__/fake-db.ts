/**
 * A minimal in-memory fake implementing only the subset of the MongoDB
 * `Db`/`Collection` API session-store.ts actually uses. There is no way
 * to run a real (even in-memory) MongoDB in this environment without
 * approving a downloaded-binary postinstall script (mongodb-memory-server),
 * which is a decision left to whoever deploys this. This fake lets
 * session-store.ts's real logic (versioning, id generation, revert
 * semantics) be exercised end to end regardless.
 */
import type { Db } from "mongodb";

type Doc = Record<string, unknown> & { _id: string };

function matches(doc: Doc, filter: Record<string, unknown>): boolean {
    return Object.entries(filter).every(([key, value]) => doc[key] === value);
}

class FakeCollection<T extends Doc> {
    private docs: T[] = [];

    async insertOne(doc: T) {
        this.docs.push(structuredClone(doc));
        return { insertedId: doc._id };
    }

    async findOne(filter: Record<string, unknown>): Promise<T | null> {
        const found = this.docs.find((d) => matches(d, filter));
        return found ? structuredClone(found) : null;
    }

    find(filter: Record<string, unknown>) {
        const matched = this.docs.filter((d) => matches(d, filter));
        let results = matched;
        const cursor = {
            sort(spec: Record<string, 1 | -1>) {
                const [key, dir] = Object.entries(spec)[0] ?? ["_id", 1];
                results = [...results].sort((a, b) => {
                    const av = a[key];
                    const bv = b[key];
                    if (av === bv) return 0;
                    return ((av as string | number) > (bv as string | number) ? 1 : -1) * dir;
                });
                return cursor;
            },
            limit(n: number) {
                results = results.slice(0, n);
                return cursor;
            },
            async toArray() {
                return results.map((d) => structuredClone(d));
            },
        };
        return cursor;
    }

    async updateOne(filter: Record<string, unknown>, update: { $set?: Record<string, unknown>; $unset?: Record<string, unknown> }) {
        const doc = this.docs.find((d) => matches(d, filter));
        if (!doc) return { matchedCount: 0 };
        if (update.$set) Object.assign(doc, update.$set);
        if (update.$unset) for (const key of Object.keys(update.$unset)) delete doc[key];
        return { matchedCount: 1 };
    }
}

export function createFakeDb(): Db {
    const collections = new Map<string, FakeCollection<Doc>>();
    return {
        collection: <T extends Doc>(name: string) => {
            if (!collections.has(name)) collections.set(name, new FakeCollection<Doc>());
            return collections.get(name) as unknown as ReturnType<Db["collection"]>;
        },
    } as unknown as Db;
}
