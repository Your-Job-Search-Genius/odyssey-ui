import type { UITree } from "@your-job-search-genius/ui-tree";
import { describe, expect, it } from "vitest";
import {
    addMessage,
    appendTreeVersion,
    createSession,
    getLatestTreeVersion,
    getSession,
    getTreeVersion,
    listMessages,
    listSessions,
    listTreeVersions,
    revertToVersion,
    setSelectedNode,
    setSessionSummary,
} from "../lib/playground/session-store.js";
import { createFakeDb } from "./fake-db.js";

const emptyTree: UITree = { rootId: "root", nodes: { root: { id: "root", kind: "primitive", tag: "div", className: [], children: [] } } };

describe("createSession", () => {
    it("creates a session and its version-0 tree in one call", async () => {
        const db = createFakeDb();
        const { session, treeVersion } = await createSession(db, { libraryVersion: "0.2.1", registryVersion: "0.2.1", initialTree: emptyTree });

        expect(session.currentTreeVersion).toBe(0);
        expect(treeVersion.version).toBe(0);
        expect(treeVersion.tree).toEqual(emptyTree);

        const fetched = await getSession(db, session._id);
        expect(fetched).toEqual(session);
    });

    it("defaults to an 'Untitled session' title", async () => {
        const db = createFakeDb();
        const { session } = await createSession(db, { libraryVersion: "0.2.1", registryVersion: "0.2.1", initialTree: emptyTree });
        expect(session.title).toBe("Untitled session");
    });
});

describe("appendTreeVersion", () => {
    it("increments the version and moves the session's currentTreeVersion pointer", async () => {
        const db = createFakeDb();
        const { session } = await createSession(db, { libraryVersion: "0.2.1", registryVersion: "0.2.1", initialTree: emptyTree });

        const v1 = await appendTreeVersion(db, { sessionId: session._id, tree: emptyTree, ops: [], summary: "Added a button." });
        expect(v1.version).toBe(1);

        const updated = await getSession(db, session._id);
        expect(updated?.currentTreeVersion).toBe(1);

        const latest = await getLatestTreeVersion(db, session._id);
        expect(latest?.version).toBe(1);
        expect(latest?.summary).toBe("Added a button.");
    });

    it("throws for a nonexistent session rather than silently creating one", async () => {
        const db = createFakeDb();
        await expect(appendTreeVersion(db, { sessionId: "does-not-exist", tree: emptyTree, ops: [], summary: "x" })).rejects.toThrow();
    });

    it("keeps every prior version retrievable by number", async () => {
        const db = createFakeDb();
        const { session } = await createSession(db, { libraryVersion: "0.2.1", registryVersion: "0.2.1", initialTree: emptyTree });
        await appendTreeVersion(db, { sessionId: session._id, tree: emptyTree, ops: [], summary: "v1" });
        await appendTreeVersion(db, { sessionId: session._id, tree: emptyTree, ops: [], summary: "v2" });

        const all = await listTreeVersions(db, session._id);
        expect(all.map((v) => v.version)).toEqual([0, 1, 2]);
        expect((await getTreeVersion(db, session._id, 0))?.summary).toBe("Initial empty canvas.");
    });
});

describe("revertToVersion", () => {
    it("appends a NEW version copying the target tree, rather than deleting anything", async () => {
        const db = createFakeDb();
        const { session } = await createSession(db, { libraryVersion: "0.2.1", registryVersion: "0.2.1", initialTree: emptyTree });
        const withButton: UITree = { rootId: "root", nodes: { ...emptyTree.nodes, btn: { id: "btn", kind: "text", value: "hi" } } };
        await appendTreeVersion(db, { sessionId: session._id, tree: withButton, ops: [], summary: "Added text." });

        const reverted = await revertToVersion(db, session._id, 0);
        expect(reverted.version).toBe(2); // new version, not a rewrite of version 0 or 1
        expect(reverted.tree).toEqual(emptyTree);
        expect(reverted.summary).toContain("Reverted to version 0");

        // Version 1 (the one reverted away from) is still there, inspectable.
        const all = await listTreeVersions(db, session._id);
        expect(all.map((v) => v.version)).toEqual([0, 1, 2]);
        expect(all[1]?.tree).toEqual(withButton);
    });

    it("throws for a target version that doesn't exist", async () => {
        const db = createFakeDb();
        const { session } = await createSession(db, { libraryVersion: "0.2.1", registryVersion: "0.2.1", initialTree: emptyTree });
        await expect(revertToVersion(db, session._id, 99)).rejects.toThrow();
    });
});

describe("messages", () => {
    it("stores and lists messages in chronological order", async () => {
        const db = createFakeDb();
        const { session } = await createSession(db, { libraryVersion: "0.2.1", registryVersion: "0.2.1", initialTree: emptyTree });
        await addMessage(db, { sessionId: session._id, role: "user", content: "Add a button" });
        await addMessage(db, { sessionId: session._id, role: "assistant", content: "Added it.", treeVersionAfter: 1 });

        const messages = await listMessages(db, session._id);
        expect(messages.map((m) => m.role)).toEqual(["user", "assistant"]);
        expect(messages[1]?.treeVersionAfter).toBe(1);
    });
});

describe("selection and summary", () => {
    it("sets and clears the selected node", async () => {
        const db = createFakeDb();
        const { session } = await createSession(db, { libraryVersion: "0.2.1", registryVersion: "0.2.1", initialTree: emptyTree });
        await setSelectedNode(db, session._id, "btn");
        expect((await getSession(db, session._id))?.selectedNodeId).toBe("btn");
        await setSelectedNode(db, session._id, undefined);
        expect((await getSession(db, session._id))?.selectedNodeId).toBeUndefined();
    });

    it("sets the session summary", async () => {
        const db = createFakeDb();
        const { session } = await createSession(db, { libraryVersion: "0.2.1", registryVersion: "0.2.1", initialTree: emptyTree });
        await setSessionSummary(db, session._id, "User built a login form.");
        expect((await getSession(db, session._id))?.sessionSummary).toBe("User built a login form.");
    });
});

describe("listSessions", () => {
    it("returns sessions sorted most-recently-updated first", async () => {
        const db = createFakeDb();
        const { session: a } = await createSession(db, { libraryVersion: "0.2.1", registryVersion: "0.2.1", initialTree: emptyTree });
        const { session: b } = await createSession(db, { libraryVersion: "0.2.1", registryVersion: "0.2.1", initialTree: emptyTree });
        // Real timestamps (session-store.ts uses `new Date()` directly, not
        // an injectable clock) -- a tiny delay guarantees updatedAt actually
        // differs, so the sort assertion below isn't racing millisecond
        // resolution.
        await new Promise((resolve) => setTimeout(resolve, 5));
        await appendTreeVersion(db, { sessionId: a._id, tree: emptyTree, ops: [], summary: "touch a" }); // bumps a's updatedAt

        const sessions = await listSessions(db);
        expect(sessions[0]?._id).toBe(a._id);
        expect(sessions[1]?._id).toBe(b._id);
    });
});
