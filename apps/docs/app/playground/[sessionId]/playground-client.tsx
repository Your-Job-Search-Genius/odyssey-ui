"use client";

/**
 * The playground's interactive shell (design system plan, Section 6.5):
 * chat left, canvas center (the preview iframe), inspector right, a
 * toolbar for session/version actions. Built with the library's own
 * components wherever they fit -- "dogfooding" the system, per the
 * plan's own instruction -- since this is hand-written application code,
 * not agent-generated tree content, so it is not itself bound by the
 * allowed-primitives-only constraint (that constraint is about what an
 * agent puts INTO the tree, not how this page is built).
 */
import { useEffect, useRef, useState } from "react";
import type { UINode, UITree } from "@your-job-search-genius/ui-tree";
import Link from "next/link";
import { LogoMark } from "~/components/site/site-header";
import { SiteOrbs } from "~/components/site/site-orbs";
import { ThemeSwitch } from "~/components/site/theme-switch";
import type { PlaygroundMessage, PlaygroundSession } from "~/lib/playground/types";
import { cx } from "@/utils/cx";

interface VersionSummary {
    version: number;
    summary: string;
    createdAt: string;
}

interface PlaygroundClientProps {
    sessionId: string;
    initialSession: PlaygroundSession;
    initialMessages: PlaygroundMessage[];
    initialTree: UITree;
    initialVersions: VersionSummary[];
    ruleSetVersion: string;
}

type StreamEvent =
    | { type: "tool_call"; name: string }
    | { type: "tool_result"; name: string; content: string }
    | { type: "tree_updated"; version: number; tree: UITree }
    | { type: "unavailable"; what: string; alternatives: string[] }
    | { type: "text"; text: string }
    | { type: "done" }
    | { type: "error"; message: string };

function emptyTree(): UITree {
    return { rootId: "root", nodes: { root: { id: "root", kind: "primitive", tag: "div", className: [], children: [] } } };
}

function nodeLabel(node: UINode): string {
    if (node.kind === "component" || node.kind === "icon") return node.name;
    if (node.kind === "primitive") return node.tag;
    return `"${node.value.length > 24 ? `${node.value.slice(0, 24)}…` : node.value}"`;
}

/** Depth-first rows for the "Tree" panel (the mockup's component tree, fed by the real UITree). */
function flattenTree(tree: UITree): { id: string; label: string; depth: number }[] {
    const rows: { id: string; label: string; depth: number }[] = [];
    const visit = (id: string, depth: number) => {
        const node = tree.nodes[id];
        if (!node) return;
        rows.push({ id, label: nodeLabel(node), depth });
        if ("children" in node) node.children.forEach((child) => visit(child, depth + 1));
    };
    visit(tree.rootId, 0);
    return rows;
}

export function PlaygroundClient({ sessionId, initialSession, initialMessages, initialTree, initialVersions, ruleSetVersion }: PlaygroundClientProps) {
    const [messages, setMessages] = useState<PlaygroundMessage[]>(initialMessages);
    const [tree, setTree] = useState<UITree>(initialTree.nodes && Object.keys(initialTree.nodes).length > 0 ? initialTree : emptyTree());
    const [versions, setVersions] = useState<VersionSummary[]>(initialVersions);
    const [selectedNodeId, setSelectedNodeId] = useState<string | undefined>(initialSession.selectedNodeId);
    const [input, setInput] = useState("");
    const [isStreaming, setIsStreaming] = useState(false);
    const [toolActivity, setToolActivity] = useState<string[]>([]);
    const [error, setError] = useState<string | undefined>();
    /** The text of the message that just failed to send, kept so "Retry" can resend it verbatim without the user retyping it. */
    const [retryText, setRetryText] = useState<string | undefined>();
    const [showCode, setShowCode] = useState(false);
    const [code, setCode] = useState<string | undefined>();
    const [copied, setCopied] = useState(false);

    const iframeRef = useRef<HTMLIFrameElement>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const postTreeToPreview = () => iframeRef.current?.contentWindow?.postMessage({ type: "tree", tree }, "*");

    useEffect(() => {
        postTreeToPreview();
    }, [tree]);

    useEffect(() => {
        function onMessage(event: MessageEvent) {
            const data = event.data as { type?: string; nodeId?: string } | undefined;
            if (!data) return;
            if (data.type === "preview_ready") postTreeToPreview();
            if (data.type === "select" && data.nodeId) setSelectedNodeId(data.nodeId);
        }
        window.addEventListener("message", onMessage);
        return () => window.removeEventListener("message", onMessage);
        // eslint-disable-next-line react-hooks/exhaustive-deps -- postTreeToPreview closes over `tree`, which is intentionally read fresh on each preview_ready without re-subscribing this listener.
    }, []);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, toolActivity]);

    /** `retry` resends exactly what failed last time, without requiring the user to retype it -- see the `retryText` state and the error banner's Retry button. */
    async function sendMessage(retry?: string) {
        const text = retry ?? input.trim();
        if (!text || isStreaming) return;
        if (!retry) setInput("");
        setError(undefined);
        setRetryText(undefined);
        setToolActivity([]);
        setIsStreaming(true);
        const userMessageId = `local-${Date.now()}`;
        setMessages((prev) => [...prev, { _id: userMessageId, sessionId, role: "user", content: text, createdAt: new Date().toISOString() }]);

        try {
            const response = await fetch("/api/playground/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ sessionId, message: text, selectedNodeId }),
            });
            if (!response.ok || !response.body) {
                const body = await response.json().catch(() => ({}));
                throw new Error(body.error ?? `Request failed (${response.status}).`);
            }

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let buffer = "";

            for (;;) {
                const { done, value } = await reader.read();
                if (done) break;
                buffer += decoder.decode(value, { stream: true });
                let newlineIndex: number;
                while ((newlineIndex = buffer.indexOf("\n")) !== -1) {
                    const line = buffer.slice(0, newlineIndex);
                    buffer = buffer.slice(newlineIndex + 1);
                    if (!line.trim()) continue;
                    try {
                        handleStreamEvent(JSON.parse(line) as StreamEvent);
                    } catch {
                        // A single malformed NDJSON line (a truncated chunk
                        // boundary, unlikely but not impossible) shouldn't
                        // abort the rest of an otherwise-good stream.
                    }
                }
            }
        } catch (err) {
            // The optimistic user message stays visible (they did type it)
            // but is now known to have never actually reached the server --
            // remove it and offer Retry with the same text, rather than
            // leaving it looking sent next to an unrelated-looking error.
            setMessages((prev) => prev.filter((m) => m._id !== userMessageId));
            setRetryText(text);
            setError(err instanceof Error ? err.message : String(err));
        } finally {
            setIsStreaming(false);
        }
    }

    function handleStreamEvent(event: StreamEvent) {
        switch (event.type) {
            case "tool_call":
                setToolActivity((prev) => [...prev, event.name]);
                return;
            case "tree_updated":
                setTree(event.tree);
                setVersions((prev) => [...prev, { version: event.version, summary: "", createdAt: new Date().toISOString() }]);
                setCode(undefined); // stale until reopened
                return;
            case "unavailable":
                setMessages((prev) => [
                    ...prev,
                    {
                        _id: `local-${Date.now()}`,
                        sessionId,
                        role: "assistant",
                        content: `Not available: ${event.what}${event.alternatives.length > 0 ? ` (closest alternatives: ${event.alternatives.join(", ")})` : ""}`,
                        createdAt: new Date().toISOString(),
                    },
                ]);
                return;
            case "text":
                setMessages((prev) => [
                    ...prev,
                    { _id: `local-${Date.now()}`, sessionId, role: "assistant", content: event.text, createdAt: new Date().toISOString() },
                ]);
                setToolActivity([]);
                return;
            case "error":
                setError(event.message);
                return;
            case "done":
                return;
        }
    }

    async function handleRevert(version: number) {
        const response = await fetch(`/api/playground/sessions/${sessionId}/revert`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ version }),
        });
        if (!response.ok) return;
        const body = await response.json();
        setTree(body.treeVersion.tree);
        setVersions((prev) => [...prev, { version: body.treeVersion.version, summary: body.treeVersion.summary, createdAt: body.treeVersion.createdAt }]);
    }

    async function handleShowCode() {
        setShowCode(true);
        if (code) return;
        const response = await fetch(`/api/playground/sessions/${sessionId}/export`);
        setCode(await response.text());
    }

    async function handleCopyCode() {
        const response = await fetch(`/api/playground/sessions/${sessionId}/export`);
        await navigator.clipboard.writeText(await response.text());
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }

    const selectedNode = selectedNodeId ? tree.nodes[selectedNodeId] : undefined;
    const latestVersion = versions.at(-1)?.version;

    return (
        <div style={{ position: "relative", overflow: "hidden", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
            <SiteOrbs orbs={[{ size: 480, color: "var(--sp-orb-1)", opacity: 0.6, position: { top: -160, left: "35%" } }]} />

            <header style={{ position: "relative", display: "flex", flexWrap: "wrap", alignItems: "center", gap: "8px 16px", padding: "14px 20px" }}>
                <Link
                    href="/"
                    style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none", color: "var(--sp-ink)", fontWeight: 800, fontSize: 18 }}
                >
                    <LogoMark />
                    Odyssey
                </Link>
                <span style={{ fontSize: 15, color: "var(--sp-subtle)" }}>/ Playground</span>
                <nav aria-label="Primary" style={{ display: "flex", flexWrap: "wrap", gap: 4, marginLeft: "auto" }}>
                    <Link className="sp-btn sp-btn-ghost" href="/docs/getting-started/introduction">
                        Docs
                    </Link>
                    <Link className="sp-btn sp-btn-ghost" href="/agent-rules">
                        MCP
                    </Link>
                    <button
                        type="button"
                        className="sp-btn sp-btn-ghost"
                        aria-pressed={showCode}
                        onClick={() => (showCode ? setShowCode(false) : void handleShowCode())}
                    >
                        {showCode ? "Canvas" : "Code"}
                    </button>
                    <a className="sp-btn sp-btn-ghost" href={`/api/playground/sessions/${sessionId}/export`}>
                        Download .tsx
                    </a>
                    <a className="sp-btn sp-btn-ghost" href="/playground">
                        New session
                    </a>
                    <ThemeSwitch />
                    <button type="button" className="sp-btn sp-btn-primary" onClick={() => void handleCopyCode()}>
                        {copied ? "Code copied" : "Copy code"}
                    </button>
                </nav>
            </header>

            <main
                id="main-content"
                style={{ position: "relative", flex: 1, display: "flex", flexWrap: "wrap", gap: 16, padding: "0 16px 16px", alignItems: "stretch" }}
            >
                {/* Left: prompt, conversation, tree, status */}
                <aside
                    className="sp-glass sp-rise"
                    aria-label="Prompt"
                    style={{ flex: "1 1 260px", maxWidth: 320, padding: 18, borderRadius: 22, display: "flex", flexDirection: "column", gap: 18 }}
                >
                    <form
                        style={{ display: "grid", gap: 8 }}
                        onSubmit={(e) => {
                            e.preventDefault();
                            void sendMessage();
                        }}
                    >
                        <label htmlFor="pg-prompt" className="sp-pg-label">
                            Describe UI
                        </label>
                        <textarea
                            id="pg-prompt"
                            className="sp-pg-textarea"
                            rows={3}
                            placeholder="A login card with email, password and a remember-me checkbox"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" && !e.shiftKey) {
                                    e.preventDefault();
                                    void sendMessage();
                                }
                            }}
                            disabled={isStreaming}
                        />
                        <button
                            type="submit"
                            className="sp-btn sp-btn-primary"
                            style={{ width: "100%" }}
                            disabled={isStreaming || !input.trim()}
                            aria-busy={isStreaming}
                        >
                            {isStreaming ? "Generating…" : "Generate with MCP"}
                        </button>
                    </form>

                    <div>
                        <div className="sp-pg-label" style={{ marginBottom: 8 }}>
                            Conversation
                        </div>
                        <div style={{ display: "grid", gap: 8, maxHeight: 280, overflowY: "auto" }}>
                            {messages.length === 0 && (
                                <p style={{ margin: 0, fontSize: 13, color: "var(--sp-subtle)" }}>Try &quot;a login form with email and password&quot;.</p>
                            )}
                            {messages.map((m) => (
                                <div key={m._id} className={m.role === "user" ? "sp-pg-msg sp-pg-msg-user" : "sp-pg-msg"}>
                                    {m.content}
                                </div>
                            ))}
                            {toolActivity.length > 0 && (
                                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                                    {toolActivity.map((name, i) => (
                                        <span key={`${name}-${i}`} className="sp-chip sp-mono">
                                            {name}
                                        </span>
                                    ))}
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>
                    </div>

                    <div>
                        <div className="sp-pg-label" style={{ marginBottom: 8 }}>
                            Tree
                        </div>
                        <nav className="sp-pg-tree sp-mono" aria-label="Component tree">
                            {flattenTree(tree).map((row) => (
                                <button
                                    key={row.id}
                                    type="button"
                                    aria-current={row.id === selectedNodeId ? "true" : undefined}
                                    style={{ paddingLeft: 10 + row.depth * 16 }}
                                    onClick={() => setSelectedNodeId(row.id)}
                                >
                                    {row.label}
                                </button>
                            ))}
                        </nav>
                    </div>

                    {/* Always mounted so screen readers announce changes (SR-04). */}
                    <div
                        role={error ? "alert" : "status"}
                        className={cx(
                            "sp-pg-status",
                            error ? "sp-pg-status-error" : isStreaming ? "sp-pg-status-busy" : latestVersion ? "sp-pg-status-ok" : "",
                        )}
                        style={{ marginTop: "auto" }}
                    >
                        {error ? (
                            <>
                                <span style={{ flex: 1 }}>{error}</span>
                                {retryText && (
                                    <button type="button" className="sp-pg-pill" style={{ minHeight: 32 }} onClick={() => void sendMessage(retryText)}>
                                        Retry
                                    </button>
                                )}
                            </>
                        ) : isStreaming ? (
                            "Generating with the MCP…"
                        ) : latestVersion ? (
                            <>
                                <svg
                                    width="16"
                                    height="16"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2.5"
                                    strokeLinecap="round"
                                    aria-hidden="true"
                                >
                                    <path d="m5 12 5 5 9-10" />
                                </svg>
                                Canvas at v{latestVersion}
                            </>
                        ) : (
                            "Ready"
                        )}
                    </div>
                </aside>

                {/* Center: live canvas. ponytail: mockup's floating bob is left off the real canvas -- it would move click targets while selecting nodes. */}
                <section
                    className="sp-glass sp-pg-canvas sp-rise"
                    aria-label="Live canvas"
                    style={{ flex: "999 1 420px", minWidth: 0, minHeight: 560, borderRadius: 22, display: "flex", padding: 32, animationDelay: ".08s" }}
                >
                    <div
                        style={{
                            flex: 1,
                            minHeight: 496,
                            background: "var(--sp-surface)",
                            borderRadius: 22,
                            overflow: "hidden",
                            boxShadow: "0 40px 80px -36px rgb(38 8 117 / 0.4), 0 2px 8px rgb(38 8 117 / 0.06)",
                        }}
                    >
                        {showCode ? (
                            <pre className="sp-code sp-mono" style={{ height: "100%", borderRadius: 0 }}>
                                <code>{code ?? "Loading..."}</code>
                            </pre>
                        ) : (
                            <iframe
                                ref={iframeRef}
                                src="/playground/preview"
                                title="Canvas preview"
                                style={{ display: "block", width: "100%", height: "100%", minHeight: 496, border: 0 }}
                                onLoad={postTreeToPreview}
                            />
                        )}
                    </div>
                </section>

                {/* Right: inspector + history, styled as the mockup's props panel */}
                <aside
                    className="sp-glass sp-rise"
                    aria-label="Inspector"
                    style={{
                        flex: "1 1 260px",
                        maxWidth: 320,
                        padding: 18,
                        borderRadius: 22,
                        display: "flex",
                        flexDirection: "column",
                        gap: 22,
                        animationDelay: ".16s",
                    }}
                >
                    <div>
                        <div className="sp-mono" style={{ fontSize: 13, color: "var(--sp-brand-ink)" }}>
                            {selectedNode ? nodeLabel(selectedNode) : "Inspector"}
                        </div>
                        <div style={{ fontSize: 13, color: "var(--sp-subtle)", marginTop: 2 }}>
                            {selectedNodeId ?? "Click a node in the canvas or tree to inspect it."}
                        </div>
                    </div>
                    {selectedNode && (
                        <div>
                            <div className="sp-pg-label" style={{ marginBottom: 10 }}>
                                {selectedNode.kind === "component" ? "props" : "node"}
                            </div>
                            <pre className="sp-pg-json sp-mono">
                                {JSON.stringify(selectedNode.kind === "component" ? selectedNode.props : selectedNode, null, 2)}
                            </pre>
                        </div>
                    )}
                    <div role="group" aria-labelledby="pg-history-label">
                        <div id="pg-history-label" className="sp-pg-label" style={{ marginBottom: 10 }}>
                            History
                        </div>
                        <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gap: 6 }}>
                            {versions.map((v) => (
                                <li key={v.version} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, fontSize: 14 }}>
                                    <span style={{ color: "var(--sp-muted)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                        v{v.version}
                                        {v.summary ? `: ${v.summary}` : ""}
                                    </span>
                                    <button
                                        type="button"
                                        className="sp-pg-pill"
                                        aria-label={`Revert to v${v.version}`}
                                        onClick={() => void handleRevert(v.version)}
                                    >
                                        Revert
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <p style={{ margin: "auto 0 0", fontSize: 12, color: "var(--sp-subtle)" }}>Rules v{ruleSetVersion}</p>
                </aside>
            </main>
        </div>
    );
}
