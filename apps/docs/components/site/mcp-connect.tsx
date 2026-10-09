"use client";

import { Tab as AriaTab, TabList as AriaTabList, TabPanel as AriaTabPanel, Tabs as AriaTabs } from "react-aria-components";

// Snippets copied from content/docs/mcp/connect-*.mdx -- keep them in sync with those pages.
const clients = [
    {
        id: "claude",
        label: "Claude",
        help: "Claude Code: add the server once, it is available in every session.",
        code: "claude mcp add writesea-ds -- npx -y @your-job-search-genius/ds-mcp",
    },
    {
        id: "chatgpt",
        label: "ChatGPT",
        help: "ChatGPT (developer mode): create a custom connector pointing at the hosted Streamable HTTP endpoint.",
        code: "Name:            Writesea DS\nMCP server URL:  https://mcp.aijobexpert.com/mcp\nAuthentication:  None",
    },
    {
        id: "editors",
        label: "Editors",
        help: "Cursor (.cursor/mcp.json) and VS Code (.vscode/mcp.json) read the same shape, or run npx @your-job-search-genius/ds-mcp init.",
        code: '{\n    "mcpServers": {\n        "writesea-ds": {\n            "command": "npx",\n            "args": ["-y", "@your-job-search-genius/ds-mcp"]\n        }\n    }\n}',
    },
];

/** The "Connect" card from the approved c-mcp mockup: a segmented tab list over each client's config. */
export function McpConnect() {
    return (
        <div className="sp-glass sp-rise" style={{ flex: "1 1 460px", minWidth: 0, padding: 20, borderRadius: 28, animationDelay: ".1s" }}>
            <h2 style={{ margin: "4px 4px 14px", fontSize: 18, fontWeight: 800 }}>Connect</h2>
            <AriaTabs defaultSelectedKey="claude">
                <AriaTabList className="sp-seg" aria-label="Client">
                    {clients.map((c) => (
                        <AriaTab key={c.id} id={c.id} className="sp-seg-tab">
                            {c.label}
                        </AriaTab>
                    ))}
                </AriaTabList>
                {clients.map((c) => (
                    <AriaTabPanel key={c.id} id={c.id}>
                        <p style={{ margin: "14px 4px", fontSize: 15, color: "var(--sp-muted)" }}>{c.help}</p>
                        <pre className="sp-code sp-mono" style={{ padding: 20, lineHeight: 1.75 }} aria-label={`${c.label} configuration`}>
                            {c.code}
                        </pre>
                    </AriaTabPanel>
                ))}
            </AriaTabs>
        </div>
    );
}
