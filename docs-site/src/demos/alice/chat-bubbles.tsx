import { ChatBubble } from "@your-job-search-genius/odyssey-ui";

export default function AliceChatBubbles() {
  return (
    <div style={{ display: "flex", gap: "2.75rem", alignItems: "flex-start" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem", alignItems: "flex-start" }}>
        <ChatBubble from="user">Re-analyse Resume</ChatBubble>
        <ChatBubble
          from="user"
          quote="Led a complete design overhaul of Moni's core ecosystem, including the mobile app, marketing website, and a bold brand refresh."
        >
          Rewrite this
        </ChatBubble>
      </div>
      <ChatBubble from="alice">
        Please answer Alice's questions above first or you can start a new chat if
        you want
      </ChatBubble>
    </div>
  );
}
