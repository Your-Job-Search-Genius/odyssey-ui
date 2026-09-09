"use client";

import { useRef, useState } from "react";
import { Avatar } from "@/components/base/avatar/avatar";
import type { AIChatboxProps, ChatArtifact, ChatMessage } from "./ai-chatbox";
import { AIChatbox } from "./ai-chatbox";

const artifacts: ChatArtifact[] = [
    { kind: "message", text: "Draft a launch note for the new glass Button" },
    { kind: "pdf", text: "Design system spec.pdf", meta: "PDF · 2.4 MB", href: "https://example.com/spec.pdf" },
    { kind: "video", text: "Component tour", meta: "Video · 2:14", href: "https://example.com/tour" },
    { kind: "image", text: "Brand board.png", meta: "Image · 1440×900", href: "https://example.com/brand.png" },
    { kind: "link", text: "Open the docs site", href: "https://example.com" },
];

const seed: ChatMessage[] = [
    { id: "m1", role: "assistant", content: "Hi! Ask me anything, or grab a resource with the 📎 below." },
    { id: "m2", role: "user", content: "How do I theme the button?" },
    {
        id: "m3",
        role: "assistant",
        content: "Override the brand color tokens, or wrap a subtree in ThemeProvider. Here are two references:",
        artifacts: [
            { kind: "pdf", text: "Theming guide.pdf", meta: "PDF · 1.1 MB", href: "https://example.com/theming.pdf" },
            { kind: "link", text: "ThemeProvider API", href: "https://example.com/theme-provider" },
        ],
    },
];

const REPLIES = [
    "Got it — frosted with the brand violet, contrast kept at AA.",
    "Done. Added an inner highlight; want it a touch bolder?",
    "Noted. That flows through the design tokens so themes stay in sync.",
];

/** A minimal controller wiring `messages`/`onSend` with a simulated reply. */
function ChatDemo(props: Partial<AIChatboxProps>) {
    const [messages, setMessages] = useState<ChatMessage[]>(seed);
    const [typing, setTyping] = useState(false);
    const n = useRef(0);
    const r = useRef(0);

    const onSend = (text: string) => {
        const id = `u${(n.current += 1)}`;
        setMessages((m) => [...m, { id, role: "user", content: text }]);
        setTyping(true);
        window.setTimeout(() => {
            setTyping(false);
            setMessages((m) => [...m, { id: `a${(n.current += 1)}`, role: "assistant", content: REPLIES[r.current++ % REPLIES.length] }]);
        }, 900);
    };

    return (
        <div style={{ width: 400, maxWidth: "100%" }}>
            <AIChatbox
                launcherPosition="inline"
                messages={messages}
                onSend={onSend}
                isTyping={typing}
                artifacts={artifacts}
                // The v2 Avatar component fills master's hand-rolled "A" tile — the AIChatbox
                // component itself keeps `avatar` as a plain ReactNode prop, so this swap only
                // happens here at the call site, not inside ai-chatbox.tsx.
                avatar={<Avatar src="https://www.untitledui.com/images/avatars/olivia-rhye?fm=webp&q=80" alt="Assistant" size="sm" />}
                {...props}
            />
        </div>
    );
}

export const BasicChatboxDemo = () => <ChatDemo />;

export const ChipsLayoutChatboxDemo = () => <ChatDemo artifactsLayout="chips" />;

export const NoArtifactsChatboxDemo = () => <ChatDemo artifacts={[]} />;

export const CustomFocusRingChatboxDemo = () => <ChatDemo focusRingColor="#e0479e" focusRingOffset={3} />;

export const LauncherChatboxDemo = () => (
    <div className="relative h-100 w-full">
        <AIChatbox
            messages={seed}
            artifacts={artifacts}
            defaultOpen={false}
            launcherPosition="bottom-right"
            avatar={<Avatar src="https://www.untitledui.com/images/avatars/olivia-rhye?fm=webp&q=80" alt="Assistant" size="sm" />}
        />
    </div>
);

export const FloatingOpenChatboxDemo = () => (
    <div className="relative h-125 w-full">
        <AIChatbox
            messages={seed}
            artifacts={artifacts}
            defaultOpen
            launcherPosition="bottom-right"
            avatar={<Avatar src="https://www.untitledui.com/images/avatars/olivia-rhye?fm=webp&q=80" alt="Assistant" size="sm" />}
        />
    </div>
);

export const BarCollapseChatboxDemo = () => <ChatDemo collapsedAs="bar" defaultOpen={false} />;
