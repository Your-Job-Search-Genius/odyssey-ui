import type { ReactNode } from "react";
import { loadRegistry } from "@your-job-search-genius/ds-registry";
import type { Metadata } from "next";
import { McpConnect } from "~/components/site/mcp-connect";
import { SiteFooter } from "~/components/site/site-footer";
import { SiteHeader } from "~/components/site/site-header";
import { SiteOrbs } from "~/components/site/site-orbs";

export const metadata: Metadata = {
    title: "MCP & agent rules",
    description:
        "How AI agents build UI from the Writesea Odyssey component library: the MCP server, its enforced workflow, the UI task guidelines, and the hard constraints.",
};

const tools = [
    "get_rules",
    "plan_ui_task",
    "list_components",
    "search_components",
    "get_component",
    "get_example",
    "get_tokens",
    "search_icons",
    "suggest_composition",
    "validate_jsx",
];

const steps = [
    { title: "Plan", desc: "Goal, deliverable, environments and stack. Clarify only what changes the result.", tool: "get_rules" },
    { title: "Pick components", desc: "Find what the library has. Never invent a component, prop or icon.", tool: "search_components" },
    { title: "Select checklists", desc: "Route the task: a login page gets Forms, Login, Buttons, Contrast, Accessibility.", tool: "plan_ui_task" },
    { title: "Build", desc: "Compose real components with token-backed classes and the checklists in view.", tool: "get_component" },
    { title: "Re-check", desc: "Record Pass, Fail, Not applicable or Not verified for every selected rule.", tool: "checklist" },
    { title: "Validate & compile", desc: "Fix every error, then type-check and build before calling it done.", tool: "validate_jsx" },
];

const PASS = { cls: "sp-badge-pass", icon: "m5 12 5 5 9-10" };
const NA = { cls: "sp-badge-na", icon: "M6 12h12" };
const NV = { cls: "sp-badge-nv", icon: "M12 7v6M12 17h.01" };

const record = [
    { id: "FORM-03", ctx: "Web form", result: "Pass", evidence: 'Form wraps fields; submit Button has type="submit".', ...PASS },
    { id: "FORM-04", ctx: "Email, password", result: "Pass", evidence: "Input label prop renders associated labels.", ...PASS },
    { id: "LOGIN-02", ctx: "Password login", result: "Pass", evidence: 'Show/hide toggle; autocomplete="current-password".', ...PASS },
    { id: "CONTRAST-03", ctx: "Light and dark", result: "Pass", evidence: "Body 12.6:1, hint text 5.9:1, measured.", ...PASS },
    { id: "SR-12", ctx: "Interactive screen", result: "Not verified", evidence: "Static check passed; NVDA walkthrough needs Windows.", ...NV },
    { id: "LOGIN-03", ctx: "Account creation", result: "Not applicable", evidence: "Sign-up not offered for this product.", ...NA },
    { id: "PWA-05", ctx: "Offline mode", result: "Not applicable", evidence: "Off by default; not requested.", ...NA },
];

const eyebrow = { fontSize: 13, color: "var(--sp-brand)", fontWeight: 500 } as const;
const monoInline = { fontSize: 14 } as const;

/** A glass card holding one block of the registry-rendered hard constraints. */
function RulesCard({ title, intro, children }: { title: string; intro?: string; children: ReactNode }) {
    return (
        <section className="sp-glass" style={{ padding: "clamp(20px, 3vw, 32px)", borderRadius: 24 }}>
            <h3 style={{ margin: 0, fontSize: 20, fontWeight: 800 }}>{title}</h3>
            {intro && <p style={{ margin: "6px 0 0", fontSize: 15, color: "var(--sp-muted)" }}>{intro}</p>}
            <div style={{ marginTop: 14 }}>{children}</div>
        </section>
    );
}

function RuleList({ rules }: { rules: string[] }) {
    return (
        <ul style={{ margin: 0, paddingLeft: 20, display: "grid", gap: 8, fontSize: 15, lineHeight: 1.6, color: "var(--sp-muted)" }}>
            {rules.map((rule) => (
                <li key={rule}>{rule}</li>
            ))}
        </ul>
    );
}

/**
 * The MCP & agent rules page, ported 1:1 from the approved "Spatial Layers"
 * c-mcp mockup. Everything below the mockup's sections is the same RuleSet the
 * MCP server's `get_rules` tool returns -- humans and agents read the same
 * rules, sourced from packages/registry. Nothing here is hand-duplicated from
 * the registry.
 */
export default function AgentRulesPage() {
    const registry = loadRegistry();
    const { rules, guidelines } = registry;
    const categories = [...guidelines.categories].sort((a, b) => Number(guidelines.mandatory.includes(b.id)) - Number(guidelines.mandatory.includes(a.id)));

    return (
        <div style={{ position: "relative", overflow: "hidden", minHeight: "100vh" }}>
            <SiteOrbs
                orbs={[
                    { size: 520, color: "var(--sp-orb-1)", opacity: 0.6, position: { top: -140, left: -100 } },
                    { size: 420, color: "var(--sp-orb-2)", opacity: 0.5, position: { top: 700, right: -120 } },
                ]}
            />
            <SiteHeader active="mcp" maxWidth={1240} />

            <main id="main-content" style={{ position: "relative", maxWidth: 1240, margin: "0 auto", padding: "56px 24px 80px", display: "grid", gap: 56 }}>
                {/* Intro + connect */}
                <section style={{ display: "flex", flexWrap: "wrap", gap: 40, alignItems: "flex-start" }}>
                    <div className="sp-rise" style={{ flex: "1 1 380px", minWidth: 0 }}>
                        <div className="sp-mono" style={eyebrow}>
                            MCP SERVER
                        </div>
                        <h1 style={{ margin: "10px 0 0", fontSize: "clamp(38px, 5vw, 60px)", lineHeight: 1.04, letterSpacing: "-0.03em", fontWeight: 800 }}>
                            Your agent, held to the same standard as your team.
                        </h1>
                        <p style={{ margin: "18px 0 0", fontSize: 18, lineHeight: 1.6, color: "var(--sp-muted)" }}>
                            The Odyssey MCP gives AI agents the real component registry, the design tokens and the UI/UX checklists. Ask for a login page and it
                            plans, follows the Forms, Login and Contrast rules, builds with real components and validates before it hands back.
                        </p>
                        <ul
                            className="sp-mono"
                            aria-label="MCP tools"
                            style={{ margin: "22px 0 0", padding: 0, listStyle: "none", display: "flex", flexWrap: "wrap", gap: 8 }}
                        >
                            {tools.map((name) => (
                                <li
                                    key={name}
                                    style={{
                                        padding: "6px 10px",
                                        borderRadius: 10,
                                        background: "var(--sp-ghost)",
                                        border: "1px solid var(--sp-line)",
                                        fontSize: 12.5,
                                        color: name === "plan_ui_task" ? "var(--sp-brand-ink)" : "var(--sp-muted)",
                                    }}
                                >
                                    {name}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <McpConnect />
                </section>

                {/* Workflow */}
                <section className="sp-glass" style={{ padding: "clamp(24px, 4vw, 48px)", borderRadius: 32, display: "flex", flexWrap: "wrap", gap: 40 }}>
                    <div style={{ flex: "1 1 300px", minWidth: 0 }}>
                        <div className="sp-mono" style={eyebrow}>
                            ENFORCED WORKFLOW
                        </div>
                        <h2 style={{ margin: "10px 0 0", fontSize: 34, lineHeight: 1.1, letterSpacing: "-0.02em", fontWeight: 800 }}>Six steps, every task.</h2>
                        <p style={{ margin: "14px 0 0", fontSize: 16, lineHeight: 1.6, color: "var(--sp-muted)" }}>
                            The server&apos;s instructions make this the default path.{" "}
                            <span className="sp-mono" style={monoInline}>
                                plan_ui_task
                            </span>{" "}
                            returns the checklists for the request,{" "}
                            <span className="sp-mono" style={monoInline}>
                                validate_jsx
                            </span>{" "}
                            returns the completion record to fill in.
                        </p>
                    </div>
                    <div className="sp-stack" style={{ flex: "1 1 520px", minWidth: 0, position: "relative" }}>
                        <div className="sp-track" aria-hidden="true">
                            <span />
                        </div>
                        <ol style={{ position: "relative", listStyle: "none", margin: 0, padding: 0, display: "grid", gap: 12 }}>
                            {steps.map((step, i) => (
                                <li
                                    key={step.title}
                                    className="sp-card sp-glass"
                                    style={{
                                        position: "relative",
                                        display: "flex",
                                        gap: 16,
                                        alignItems: "flex-start",
                                        padding: "16px 18px",
                                        borderRadius: 18,
                                        animationDelay: `${i * 0.12}s, ${1.2 + i * 1.2}s`,
                                    }}
                                >
                                    <span
                                        aria-hidden="true"
                                        style={{
                                            flex: "none",
                                            width: 22,
                                            height: 22,
                                            marginTop: 2,
                                            borderRadius: "50%",
                                            background: "var(--sp-brand)",
                                            color: "#fff",
                                            fontSize: 12,
                                            fontWeight: 800,
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            boxShadow: "0 0 0 5px var(--sp-surface)",
                                        }}
                                    >
                                        {i + 1}
                                    </span>
                                    <div style={{ minWidth: 0 }}>
                                        <div style={{ fontWeight: 800, fontSize: 17 }}>{step.title}</div>
                                        <div style={{ fontSize: 14, color: "var(--sp-muted)", marginTop: 3, lineHeight: 1.55 }}>{step.desc}</div>
                                    </div>
                                    <span
                                        className="sp-mono"
                                        style={{
                                            marginLeft: "auto",
                                            fontSize: 12,
                                            color: "var(--sp-brand-ink)",
                                            background: "var(--sp-tint-soft)",
                                            padding: "4px 8px",
                                            borderRadius: 8,
                                            whiteSpace: "nowrap",
                                        }}
                                    >
                                        {step.tool}
                                    </span>
                                </li>
                            ))}
                        </ol>
                    </div>
                </section>

                {/* Rule categories */}
                <section aria-labelledby="rule-categories">
                    <h2 id="rule-categories" style={{ margin: 0, fontSize: 34, letterSpacing: "-0.02em", fontWeight: 800 }}>
                        Rule categories
                    </h2>
                    <p style={{ margin: "10px 0 0", fontSize: 17, color: "var(--sp-muted)", maxWidth: 640 }}>
                        Selected per task by <span className="sp-mono">plan_ui_task</span>. Color contrast and screen readers (NVDA) apply to every UI task; the
                        rest only when the task needs them. Full text: <span className="sp-mono">ds://guidelines</span>.
                    </p>
                    <ul
                        style={{
                            margin: "28px 0 0",
                            padding: 0,
                            listStyle: "none",
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
                            gap: 16,
                        }}
                    >
                        {categories.map((category, i) => {
                            const always = guidelines.mandatory.includes(category.id);
                            const prefix = category.markdown.match(/^(?:\| |- )([A-Z0-9]+)-\d+/m)?.[1] ?? category.id.toUpperCase();
                            return (
                                <li
                                    key={category.id}
                                    className="sp-rule sp-glass sp-rise"
                                    style={{ display: "flex", flexDirection: "column", gap: 8, padding: 20, borderRadius: 20, animationDelay: `${i * 0.06}s` }}
                                >
                                    <span style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
                                        <span className="sp-mono" style={{ fontSize: 12, color: "var(--sp-brand-ink)" }}>
                                            {prefix}
                                        </span>
                                        <span
                                            className={always ? "sp-tag-always" : "sp-tag-when"}
                                            style={{ fontSize: 12, fontWeight: 700, padding: "3px 8px", borderRadius: 999 }}
                                        >
                                            {always ? "Always" : "When needed"}
                                        </span>
                                    </span>
                                    <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800 }}>{category.name}</h3>
                                    <span style={{ fontSize: 14, lineHeight: 1.55, color: "var(--sp-muted)" }}>{category.appliesWhen}</span>
                                </li>
                            );
                        })}
                    </ul>
                </section>

                {/* Completion record */}
                <section className="sp-glass" style={{ padding: "8px 0 4px", borderRadius: 28 }} aria-labelledby="completion-record">
                    <div style={{ padding: "24px 24px 8px", display: "flex", flexWrap: "wrap", gap: "8px 16px", alignItems: "baseline" }}>
                        <h2 id="completion-record" style={{ margin: 0, fontSize: 24, fontWeight: 800 }}>
                            Completion record
                        </h2>
                        <span style={{ fontSize: 15, color: "var(--sp-muted)" }}>Sample: “Build a login page”</span>
                    </div>
                    <div style={{ overflowX: "auto", padding: "0 8px" }}>
                        <table className="sp-table sp-rtable">
                            <thead>
                                <tr>
                                    <th scope="col">Rule ID</th>
                                    <th scope="col">Applicability</th>
                                    <th scope="col">Result</th>
                                    <th scope="col">Evidence or reason</th>
                                </tr>
                            </thead>
                            <tbody>
                                {record.map((row) => (
                                    <tr key={row.id}>
                                        <td>
                                            <span className="sp-mono" style={{ fontWeight: 500 }}>
                                                {row.id}
                                            </span>
                                        </td>
                                        <td style={{ color: "var(--sp-muted)" }}>{row.ctx}</td>
                                        <td>
                                            <span className={`sp-badge ${row.cls}`}>
                                                <svg
                                                    width="12"
                                                    height="12"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="3"
                                                    strokeLinecap="round"
                                                    aria-hidden="true"
                                                >
                                                    <path d={row.icon} />
                                                </svg>
                                                {row.result}
                                            </span>
                                        </td>
                                        <td style={{ color: "var(--sp-muted)" }}>{row.evidence}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* Hard constraints: the registry RuleSet, verbatim, in the same visual language. */}
                <section aria-labelledby="hard-constraints" style={{ display: "grid", gap: 20 }}>
                    <div>
                        <div className="sp-mono" style={eyebrow}>
                            AGENT RULES V{rules.version}
                        </div>
                        <h2 id="hard-constraints" style={{ margin: "10px 0 0", fontSize: 34, letterSpacing: "-0.02em", fontWeight: 800 }}>
                            Hard constraints
                        </h2>
                        <p style={{ margin: "10px 0 0", fontSize: 17, lineHeight: 1.6, color: "var(--sp-muted)", maxWidth: 760 }}>
                            Enforced by <span className="sp-mono">validate_jsx</span>, not just stated here -- this page and the MCP server&apos;s{" "}
                            <span className="sp-mono">get_rules</span> tool render the exact same data. They apply to apps consuming the published package, not
                            to development inside the odyssey-ui monorepo itself, where library source necessarily uses native elements, the{" "}
                            <span className="sp-mono">@/</span> alias, and internal dependencies.
                        </p>
                    </div>

                    <RulesCard title="Allowed HTML primitives" intro="Only these raw HTML elements may appear in generated UI, alongside library components.">
                        <div className="sp-mono" style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                            {rules.allowedPrimitives.map((tag) => (
                                <span key={tag} className="sp-badge sp-badge-pass">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </RulesCard>

                    <RulesCard title="Forbidden elements" intro="Never used directly -- always replaced by the closest approved library component.">
                        <div className="sp-mono" style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                            {rules.forbiddenElements.map((tag) => (
                                <span key={tag} className="sp-badge sp-badge-nv">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </RulesCard>

                    <RulesCard
                        title="Project setup"
                        intro="How a consuming app gets the library: install the published package and import from it -- never copy source or use a repo-local alias."
                    >
                        <RuleList rules={rules.setupRules} />
                    </RulesCard>

                    <RulesCard title="Style rules">
                        <RuleList rules={rules.styleRules} />
                    </RulesCard>

                    <RulesCard title="Composition rules">
                        <RuleList rules={rules.compositionRules} />
                    </RulesCard>
                </section>

                <section aria-labelledby="standing-rules" style={{ display: "grid", gap: 20 }}>
                    <div>
                        <h2 id="standing-rules" style={{ margin: 0, fontSize: 34, letterSpacing: "-0.02em", fontWeight: 800 }}>
                            UI/UX &amp; accessibility standing rules
                        </h2>
                        <div style={{ marginTop: 12, display: "grid", gap: 12, maxWidth: 860 }}>
                            {rules.uxPreamble.map((line) => (
                                <p key={line} style={{ margin: 0, fontSize: 16, lineHeight: 1.6, color: "var(--sp-muted)" }}>
                                    {line}
                                </p>
                            ))}
                        </div>
                    </div>
                    {rules.uxSections.map((section) => (
                        <section key={section.id} className="sp-glass" style={{ padding: "clamp(20px, 3vw, 32px)", borderRadius: 24 }}>
                            <h3 style={{ margin: 0, fontSize: 20, fontWeight: 800, display: "flex", flexWrap: "wrap", alignItems: "center", gap: 10 }}>
                                <span className="sp-chip sp-mono">{section.id}</span>
                                {section.title}
                            </h3>
                            {section.intro?.map((line) => (
                                <p key={line} style={{ margin: "8px 0 0", fontSize: 15, lineHeight: 1.6, color: "var(--sp-muted)" }}>
                                    {line}
                                </p>
                            ))}
                            <div style={{ marginTop: 14 }}>
                                <RuleList rules={section.rules} />
                            </div>
                        </section>
                    ))}
                </section>

                <p style={{ margin: 0, fontSize: 14, color: "var(--sp-subtle)" }}>
                    Registry built from library version {registry.version} -- {registry.components.length} components, {registry.tokens.colors.length} color
                    tokens, {registry.icons.length} icons.
                </p>
            </main>
            <SiteFooter />
        </div>
    );
}
