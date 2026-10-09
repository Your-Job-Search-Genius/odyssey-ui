/**
 * The `build-ui` prompt from the plan (Section 4.3): a template that
 * steers the calling agent through the intended tool-call sequence
 * (get_rules -> plan_ui_task -> discover -> build -> re-check -> validate_jsx -> compile) rather than trying to
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
                            `2. Call plan_ui_task with "${description}" and fill in its plan before writing code.`,
                            "3. If you are scaffolding or working in a consumer app, make sure @your-job-search-genius/odyssey-ui is installed per get_rules' setup section (.npmrc for GitHub Packages, install the package, wire the styles). Never copy component source into the app and never scan a local directory for components.",
                            "4. Call list_components / search_components / get_component to confirm what actually exists before assuming a component name.",
                            '5. Compose the UI from approved components and the allowed HTML primitives only, styled with token-backed Tailwind classes (see get_tokens). Import every component and icon from the @your-job-search-genius/odyssey-ui package specifier reported by get_component\'s importPath -- never from a local "@/" alias.',
                            "6. If something is genuinely missing from the library, say so explicitly and offer the closest available alternative -- never invent a component, prop, or icon.",
                            "7. Re-check every rule ID in the plan's completion record, call validate_jsx (fix and repeat until clean), run the project's type-check/build, and finish with the filled completion record. Unverified items are Not verified, never Pass.",
                        ].join("\n"),
                    },
                },
            ],
        }),
    );
}
