/**
 * Registry override for CodeBlock. See packages/registry/src/schema.ts's
 * ComponentMetaOverrideSchema for the full shape.
 */
export const componentMeta = {
    description:
        "Read-only monospace block for code, JSON payloads, logs and secrets, with an optional caption and copy button. The approved replacement for raw <pre>/<code>.",
    allowedChildren: "none",
    a11y: "The copy button has an accessible name and its result is announced in a polite live region. When the content can scroll (long lines, or maxHeight set) the block is a focusable, labelled region so keyboard users can scroll it.",
    doNot: [
        "Do not use a raw <pre> or <code>, or a div with whitespace-pre-wrap, for code or JSON -- use CodeBlock.",
        "Do not put CodeBlock inside an Alert description (it renders block content); put it in the Alert's children or actions instead.",
        "Do not rely on the copy icon swap alone for feedback in critical flows; pass onCopy and show a toast when the copy result matters.",
    ],
    examples: [
        { title: "JSON payload", code: '<CodeBlock language="JSON" code={JSON.stringify(payload, null, 2)} />' },
        { title: "Wrapped log line", code: '<CodeBlock language="Log" isWrapped code={line} />' },
        { title: "Long output, capped height", code: '<CodeBlock language="Sync log" maxHeight="md" code={log} />' },
        {
            title: "Copy with toast feedback",
            code: '<CodeBlock code={apiKey} onCopy={({ success }) => (success ? toast.success("Copied") : toast.error("Copy failed"))} />',
        },
    ],
};
