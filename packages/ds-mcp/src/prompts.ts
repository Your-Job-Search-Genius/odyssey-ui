/**
 * The `build-ui` prompt from the plan (Section 4.3): a template that
 * steers the calling agent through the intended tool-call sequence
 * (get_rules -> discover -> build -> validate_jsx) rather than trying to
 * build UI inside the server itself.
 */
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

export function registerPrompts(server: McpServer) {
    server.registerPrompt(
        "build-ui",
        {
            title: "Build UI",
            description: "Guides an agent through building UI from this design system: rules, discovery, composition, then validation.",
            argsSchema: { description: z.string() },
        },
        ({ description }) => ({
            messages: [
                {
                    role: "user",
                    content: {
                        type: "text",
                        text: [
                            `Build this UI using only the Writesea Odyssey component library: "${description}".`,
                            "",
                            "Follow this sequence:",
                            "1. Call get_rules first. Do not skip this even if you recall the rules from a previous turn in this session.",
                            "2. Call list_components / search_components to discover what actually exists before assuming a component name.",
                            "3. Compose the UI from approved components and the allowed HTML primitives (div, span, p, h1-h6) only, styled with token-backed Tailwind classes (see get_tokens).",
                            "4. If something is genuinely missing from the library (no matching component, no matching icon), say so explicitly and offer the closest available alternative -- never invent a component, prop, or icon.",
                            "5. Call validate_jsx on the result before presenting it as final. If it returns errors, fix them and call it again.",
                        ].join("\n"),
                    },
                },
            ],
        }),
    );
}
