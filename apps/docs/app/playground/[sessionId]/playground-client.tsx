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
import type { UITree } from "@your-job-search-genius/ui-tree";
import type { PlaygroundMessage, PlaygroundSession } from "~/lib/playground/types";
import { Badge } from "@/components/base/badges/badges";
import { Button } from "@/components/base/buttons/button";
import { TextArea } from "@/components/base/textarea/textarea";
import { RefreshCw01 } from "@/components/foundations/icons";

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
    }

    return (
        <div className="flex h-screen flex-col">
            <header className="flex items-center justify-between border-b border-secondary px-4 py-2.5">
                <span className="text-sm font-semibold text-primary">Playground</span>
                <div className="flex items-center gap-2">
                    <Button size="sm" color="secondary" onPress={() => (showCode ? setShowCode(false) : void handleShowCode())}>
                        {showCode ? "Canvas" : "Code"}
                    </Button>
                    <Button size="sm" color="secondary" onPress={handleCopyCode}>
                        Copy code
                    </Button>
                    <Button size="sm" color="secondary" href={`/api/playground/sessions/${sessionId}/export`}>
                        Download .tsx
                    </Button>
                    <Button size="sm" color="link-gray" href="/playground" iconLeading={RefreshCw01}>
                        New session
                    </Button>
                </div>
            </header>

            <div className="flex min-h-0 flex-1">
                <section className="flex w-96 flex-col border-r border-secondary">
                    <div className="flex-1 space-y-3 overflow-y-auto p-4">
                        {messages.length === 0 && (
                            <p className="text-sm text-tertiary">Describe the UI you want to build. Try &quot;a login form with email and password&quot;.</p>
                        )}
                        {messages.map((m) => (
                            <div
                                key={m._id}
                                className={
                                    m.role === "user"
                                        ? "ml-auto max-w-[85%] rounded-lg bg-brand-solid px-3 py-2 text-sm text-white"
                                        : "max-w-[85%] rounded-lg bg-secondary px-3 py-2 text-sm text-primary"
                                }
                            >
                                {m.content}
                            </div>
                        ))}
                        {toolActivity.length > 0 && (
                            <div className="flex flex-wrap gap-1.5">
                                {toolActivity.map((name, i) => (
                                    <Badge key={`${name}-${i}`} size="sm" color="gray">
                                        {name}
                                    </Badge>
                                ))}
                            </div>
                        )}
                        {error && (
                            <div className="flex items-center justify-between gap-2 rounded-lg bg-error-secondary px-3 py-2">
                                <p className="text-sm text-error-primary">{error}</p>
                                {retryText && (
                                    <Button size="xs" color="link-color" onPress={() => void sendMessage(retryText)}>
                                        Retry
                                    </Button>
                                )}
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                    <div className="flex items-end gap-2 border-t border-secondary p-3">
                        <TextArea
                            className="flex-1"
                            rows={2}
                            placeholder="Describe the UI you want..."
                            value={input}
                            onChange={setInput}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" && !e.shiftKey) {
                                    e.preventDefault();
                                    void sendMessage();
                                }
                            }}
                            isDisabled={isStreaming}
                        />
                        <Button size="md" onPress={() => void sendMessage()} isDisabled={isStreaming || !input.trim()} isLoading={isStreaming}>
                            Send
                        </Button>
                    </div>
                </section>

                <section className="min-w-0 flex-1 bg-secondary">
                    {showCode ? (
                        <pre className="h-full overflow-auto p-4 text-xs text-primary">
                            <code>{code ?? "Loading..."}</code>
                        </pre>
                    ) : (
                        <iframe
                            ref={iframeRef}
                            src="/playground/preview"
                            title="Canvas preview"
                            className="h-full w-full border-0 bg-primary"
                            onLoad={postTreeToPreview}
                        />
                    )}
                </section>

                <aside className="w-72 border-l border-secondary p-4">
                    <h2 className="text-sm font-semibold text-primary">Inspector</h2>
                    {selectedNodeId ? (
                        <div className="mt-3 space-y-2 text-sm">
                            <p className="text-tertiary">
                                Selected: <span className="font-mono text-primary">{selectedNodeId}</span>
                            </p>
                            <pre className="overflow-auto rounded-lg bg-secondary p-2 text-xs text-primary">
                                {JSON.stringify(tree.nodes[selectedNodeId], null, 2)}
                            </pre>
                        </div>
                    ) : (
                        <p className="mt-3 text-sm text-tertiary">Click a node in the canvas to inspect it.</p>
                    )}

                    <h2 className="mt-6 text-sm font-semibold text-primary">History</h2>
                    <ul className="mt-3 space-y-1.5">
                        {versions.map((v) => (
                            <li key={v.version} className="flex items-center justify-between text-sm">
                                <span className="truncate text-tertiary">
                                    v{v.version}
                                    {v.summary ? `: ${v.summary}` : ""}
                                </span>
                                <Button size="xs" color="link-gray" onPress={() => void handleRevert(v.version)}>
                                    Revert
                                </Button>
                            </li>
                        ))}
                    </ul>

                    <p className="mt-6 text-xs text-quaternary">Rules v{ruleSetVersion}</p>
                </aside>
            </div>
        </div>
    );
}
