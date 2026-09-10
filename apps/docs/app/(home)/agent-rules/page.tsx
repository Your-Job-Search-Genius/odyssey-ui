import { loadRegistry } from "@your-job-search-genius/ds-registry";
import type { Metadata } from "next";
import { Badge } from "@/components/base/badges/badges";

export const metadata: Metadata = {
    title: "Agent rules",
    description: "The hard constraints AI agents must follow when building UI from the Writesea Odyssey component library.",
};

/**
 * Renders the exact same RuleSet the MCP server's `get_rules` tool
 * returns to Claude Code / Cursor -- humans and agents read the same
 * rules, sourced from packages/registry (see its README's "Rules"
 * section). Nothing here is hand-duplicated from the registry.
 */
export default function AgentRulesPage() {
    const registry = loadRegistry();
    const { rules } = registry;

    return (
        <main className="mx-auto flex max-w-3xl flex-1 flex-col px-4 py-16">
            <span className="w-fit rounded-full bg-brand-secondary px-3 py-1 text-sm font-medium text-brand-secondary">Agent rules v{rules.version}</span>
            <h1 className="mt-6 text-display-sm font-semibold text-primary">Agent rules</h1>
            <p className="mt-4 text-lg text-tertiary">
                These are the hard constraints any AI agent (via <code className="text-brand-secondary">@your-job-search-genius/ds-mcp</code>) must follow when
                generating UI from this library. They are enforced by the <code className="text-brand-secondary">validate_jsx</code> tool, not just stated here
                -- this page and the MCP server&apos;s <code className="text-brand-secondary">get_rules</code> tool render the exact same data.
            </p>

            <section className="mt-12">
                <h2 className="text-lg font-semibold text-primary">Allowed HTML primitives</h2>
                <p className="mt-1 text-sm text-tertiary">Only these raw HTML elements may appear in generated UI, alongside library components.</p>
                <div className="mt-3 flex flex-wrap gap-2">
                    {rules.allowedPrimitives.map((tag) => (
                        <Badge key={tag} color="success" size="md">
                            {tag}
                        </Badge>
                    ))}
                </div>
            </section>

            <section className="mt-10">
                <h2 className="text-lg font-semibold text-primary">Forbidden elements</h2>
                <p className="mt-1 text-sm text-tertiary">Never used directly -- always replaced by the closest approved library component.</p>
                <div className="mt-3 flex flex-wrap gap-2">
                    {rules.forbiddenElements.map((tag) => (
                        <Badge key={tag} color="error" size="md">
                            {tag}
                        </Badge>
                    ))}
                </div>
            </section>

            <section className="mt-10">
                <h2 className="text-lg font-semibold text-primary">Style rules</h2>
                <ul className="mt-3 list-disc space-y-2 pl-5 text-tertiary">
                    {rules.styleRules.map((rule) => (
                        <li key={rule}>{rule}</li>
                    ))}
                </ul>
            </section>

            <section className="mt-10">
                <h2 className="text-lg font-semibold text-primary">Composition rules</h2>
                <ul className="mt-3 list-disc space-y-2 pl-5 text-tertiary">
                    {rules.compositionRules.map((rule) => (
                        <li key={rule}>{rule}</li>
                    ))}
                </ul>
            </section>

            <p className="mt-12 text-sm text-quaternary">
                Registry built from library version {registry.version} -- {registry.components.length} components, {registry.tokens.colors.length} color tokens,{" "}
                {registry.icons.length} icons.
            </p>
        </main>
    );
}
