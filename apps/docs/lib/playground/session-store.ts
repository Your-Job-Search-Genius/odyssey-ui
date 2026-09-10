/**
 * CRUD for the three playground collections (design system plan,
 * Section 6.4): sessions, messages, treeVersions. Every function takes
 * a `Db` as its first argument (rather than importing db.ts's
 * getDb() internally) so this module is testable against a fake Db
 * (see __tests__/session-store.test.ts) without a live MongoDB --
 * there is no way to run a real one in this environment without
 * approving a downloaded-binary postinstall script, which is a
 * decision left to whoever deploys this, not made here.
 */
import type { UITree } from "@your-job-search-genius/ui-tree";
import type { TreeOp } from "@your-job-search-genius/ui-tree";
import type { Db } from "mongodb";
import { randomUUID } from "node:crypto";
import type { PlaygroundMessage, PlaygroundSession, PlaygroundTreeVersion, ToolCallRecord, ToolResultRecord } from "./types";

function sessions(db: Db) {
    return db.collection<PlaygroundSession>("sessions");
}
function messages(db: Db) {
    return db.collection<PlaygroundMessage>("messages");
}
function treeVersions(db: Db) {
    return db.collection<PlaygroundTreeVersion>("treeVersions");
}

export interface CreateSessionInput {
    libraryVersion: string;
    registryVersion: string;
    initialTree: UITree;
    title?: string;
}

export async function createSession(db: Db, input: CreateSessionInput): Promise<{ session: PlaygroundSession; treeVersion: PlaygroundTreeVersion }> {
    const now = new Date().toISOString();
    const sessionId = randomUUID();

    const treeVersion: PlaygroundTreeVersion = {
        _id: randomUUID(),
        sessionId,
        version: 0,
        tree: input.initialTree,
        ops: [],
        summary: "Initial empty canvas.",
        createdAt: now,
    };

    const session: PlaygroundSession = {
        _id: sessionId,
        title: input.title ?? "Untitled session",
        createdAt: now,
        updatedAt: now,
        libraryVersion: input.libraryVersion,
        registryVersion: input.registryVersion,
        currentTreeVersion: 0,
    };

    await treeVersions(db).insertOne(treeVersion);
    await sessions(db).insertOne(session);
    return { session, treeVersion };
}

export async function getSession(db: Db, sessionId: string): Promise<PlaygroundSession | null> {
    return sessions(db).findOne({ _id: sessionId });
}

export async function listSessions(db: Db, limit = 50): Promise<PlaygroundSession[]> {
    return sessions(db).find({}).sort({ updatedAt: -1 }).limit(limit).toArray();
}

export async function getTreeVersion(db: Db, sessionId: string, version: number): Promise<PlaygroundTreeVersion | null> {
    return treeVersions(db).findOne({ sessionId, version });
}

export async function getLatestTreeVersion(db: Db, sessionId: string): Promise<PlaygroundTreeVersion | null> {
    const session = await getSession(db, sessionId);
    if (!session) return null;
    return getTreeVersion(db, sessionId, session.currentTreeVersion);
}

export async function listTreeVersions(db: Db, sessionId: string): Promise<PlaygroundTreeVersion[]> {
    return treeVersions(db).find({ sessionId }).sort({ version: 1 }).toArray();
}

export interface AppendTreeVersionInput {
    sessionId: string;
    tree: UITree;
    ops: TreeOp[];
    summary: string;
}

/** Every accepted propose_ops call goes through here -- one new, immutable version per acceptance, never an in-place tree mutation. */
export async function appendTreeVersion(db: Db, input: AppendTreeVersionInput): Promise<PlaygroundTreeVersion> {
    const session = await getSession(db, input.sessionId);
    if (!session) throw new Error(`Session "${input.sessionId}" does not exist.`);

    const nextVersion = session.currentTreeVersion + 1;
    const treeVersion: PlaygroundTreeVersion = {
        _id: randomUUID(),
        sessionId: input.sessionId,
        version: nextVersion,
        tree: input.tree,
        ops: input.ops,
        summary: input.summary,
        createdAt: new Date().toISOString(),
    };

    await treeVersions(db).insertOne(treeVersion);
    await sessions(db).updateOne({ _id: input.sessionId }, { $set: { currentTreeVersion: nextVersion, updatedAt: treeVersion.createdAt } });
    return treeVersion;
}

/**
 * Revert is a pointer move plus a new version that records the revert
 * (plan, Section 6.4) -- not a delete of anything after the target
 * version, so the full history (including what was reverted away from)
 * stays inspectable.
 */
export async function revertToVersion(db: Db, sessionId: string, targetVersion: number): Promise<PlaygroundTreeVersion> {
    const target = await getTreeVersion(db, sessionId, targetVersion);
    if (!target) throw new Error(`Version ${targetVersion} does not exist for session "${sessionId}".`);
    return appendTreeVersion(db, { sessionId, tree: target.tree, ops: [], summary: `Reverted to version ${targetVersion}.` });
}

export async function setSelectedNode(db: Db, sessionId: string, nodeId: string | undefined): Promise<void> {
    await sessions(db).updateOne({ _id: sessionId }, nodeId ? { $set: { selectedNodeId: nodeId } } : { $unset: { selectedNodeId: "" } });
}

export async function setSessionSummary(db: Db, sessionId: string, summary: string): Promise<void> {
    await sessions(db).updateOne({ _id: sessionId }, { $set: { sessionSummary: summary } });
}

export interface AddMessageInput {
    sessionId: string;
    role: "user" | "assistant" | "tool";
    content: string;
    toolCalls?: ToolCallRecord[];
    toolResults?: ToolResultRecord[];
    treeVersionAfter?: number;
}

export async function addMessage(db: Db, input: AddMessageInput): Promise<PlaygroundMessage> {
    const message: PlaygroundMessage = {
        _id: randomUUID(),
        sessionId: input.sessionId,
        role: input.role,
        content: input.content,
        toolCalls: input.toolCalls,
        toolResults: input.toolResults,
        treeVersionAfter: input.treeVersionAfter,
        createdAt: new Date().toISOString(),
    };
    await messages(db).insertOne(message);
    return message;
}

export async function listMessages(db: Db, sessionId: string): Promise<PlaygroundMessage[]> {
    return messages(db).find({ sessionId }).sort({ createdAt: 1 }).toArray();
}
