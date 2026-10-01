"use client";

import { CodeBlock } from "@/components/base/code-block/code-block";

const payload = JSON.stringify(
    {
        id: "evt_01J8Z6",
        type: "campaign.launched",
        createdAt: "2026-09-30T14:02:11Z",
        data: { campaignId: "cmp_4821", audience: 1284, sender: "outreach@example.com" },
    },
    null,
    2,
);

export const DefaultDemo = () => <CodeBlock language="JSON" code={payload} className="w-full max-w-xl" />;

export const WrappedDemo = () => (
    <CodeBlock
        language="Log"
        isWrapped
        className="w-full max-w-md"
        code="2026-09-30 14:02:11 WARN smtp.relay: deferred delivery to recipient@example.org -- 421 4.7.0 Try again later, closing connection (attempt 3 of 5)"
    />
);

export const ScrollingDemo = () => (
    <CodeBlock
        language="Sync log"
        maxHeight="sm"
        className="w-full max-w-xl"
        code={Array.from({ length: 30 }, (_, i) => `[${String(i + 1).padStart(2, "0")}] synced batch ${i + 1} (200 records)`).join("\n")}
    />
);

export const NoChromeDemo = () => <CodeBlock showCopy={false} code="npm install @your-job-search-genius/odyssey-ui" className="w-full max-w-md" />;
