"use client";

import { type CSSProperties, useState } from "react";
import Link from "next/link";
import { SiteFooter } from "~/components/site/site-footer";
import { SiteHeader } from "~/components/site/site-header";
import { SiteOrbs } from "~/components/site/site-orbs";

/** Home page, ported 1:1 from the approved "Spatial Layers" mockup (c-home). */

const cats = [
    {
        title: "Base components",
        desc: "Buttons, inputs, selects, badges, toggles and every foundational control.",
        count: "23 components",
        icon: "M12 3 3 8l9 5 9-5-9-5ZM3 16l9 5 9-5M3 12l9 5 9-5",
        href: "/docs/base-components",
    },
    {
        title: "Application",
        desc: "Modals, tables, date pickers, charts, sidebar shell and more.",
        count: "23 patterns",
        icon: "M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z",
        href: "/docs/application",
    },
    {
        title: "Foundations",
        desc: "1,100+ line icons, featured icons, logos and visual primitives.",
        count: "1,100+ icons",
        icon: "M12 3v18M3 12h18M5.6 5.6l12.8 12.8M18.4 5.6 5.6 18.4",
        href: "/docs/foundations",
    },
    {
        title: "Shared assets",
        desc: "Illustrations, background patterns, credit cards and mockups.",
        count: "6 asset sets",
        icon: "M4 6h16v12H4zM4 14l4-4 4 4 3-3 5 5",
        href: "/docs/shared-assets",
    },
];

const steps = [
    { title: "Plan", desc: "Restate the goal, deliverable and constraints." },
    { title: "Pick components", desc: "search_components finds what exists." },
    { title: "Checklist", desc: "plan_ui_task routes to Forms, Login, Contrast…" },
    { title: "Build", desc: "Compose with tokens and real components." },
    { title: "Re-check", desc: "Record Pass, N/A or Not verified per rule." },
    { title: "Validate", desc: "validate_jsx, then type-check and compile." },
];

const promises = ["Keyboard: Tab, arrows, Enter, Space, Escape", "NVDA browse and focus modes", "WCAG 2.2 AA contrast in light and dark"];

const section: CSSProperties = { position: "relative", maxWidth: 1240, margin: "0 auto" };
const eyebrow: CSSProperties = { fontSize: 13, color: "var(--sp-brand)", fontWeight: 500 };
const h2: CSSProperties = { margin: "10px 0 0", fontSize: 36, lineHeight: 1.1, letterSpacing: "-0.02em", fontWeight: 800 };
const lead: CSSProperties = { margin: "16px 0 0", fontSize: 17, lineHeight: 1.6, color: "var(--sp-muted)" };
const fieldLabel: CSSProperties = { fontSize: 13, fontWeight: 700, color: "var(--sp-muted)" };
const pill: CSSProperties = { padding: "4px 10px", borderRadius: 999, fontSize: 12, fontWeight: 700 };
const bar = (height: string, background: string, delay: string): CSSProperties => ({
    flex: 1,
    height,
    background,
    borderRadius: "4px 4px 0 0",
    animationDelay: delay,
});
const float = (z: string, delay: string, rest: CSSProperties): CSSProperties => ({ ["--z" as string]: z, animationDelay: delay, ...rest });

function Check({ stroke = "var(--sp-brand)" }: { stroke?: string }) {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
            <path d="m5 12 5 5 9-10" />
        </svg>
    );
}

export default function HomePage() {
    const [on, setOn] = useState(true);

    return (
        <div style={{ position: "relative", overflow: "hidden", minHeight: "100vh" }}>
            <SiteOrbs
                orbs={[
                    { size: 520, color: "var(--sp-orb-1)", opacity: 0.7, position: { top: -160, right: -80 } },
                    { size: 420, color: "var(--sp-orb-2)", opacity: 0.7, position: { top: 380, left: -160 } },
                    { size: 460, color: "var(--sp-orb-3)", opacity: 0.9, position: { top: 1500, right: "10%" } },
                ]}
            />

            <SiteHeader variant="home" maxWidth={1240} />

            <main id="main-content">
                {/* Hero */}
                <section style={{ ...section, padding: "72px 24px 40px", display: "flex", flexWrap: "wrap", alignItems: "center", gap: 48 }}>
                    <div style={{ flex: "1 1 420px", minWidth: 0 }}>
                        <div
                            className="sp-home-rise sp-glass"
                            style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: 8,
                                padding: "8px 14px",
                                borderRadius: 999,
                                fontSize: 14,
                                fontWeight: 700,
                                color: "var(--sp-brand-ink)",
                            }}
                        >
                            <span style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--sp-brand)" }} />
                            Now with an MCP server for AI agents
                        </div>
                        <h1
                            className="sp-home-rise"
                            style={{
                                margin: "24px 0 0",
                                fontSize: "clamp(44px, 6vw, 76px)",
                                lineHeight: 1.02,
                                letterSpacing: "-0.035em",
                                fontWeight: 800,
                                animationDelay: ".08s",
                            }}
                        >
                            Interfaces with
                            <br />
                            <span style={{ color: "var(--sp-brand)" }}>depth</span>, built
                            <br />
                            to be understood.
                        </h1>
                        <p
                            className="sp-home-rise"
                            style={{ margin: "24px 0 0", maxWidth: 520, fontSize: 19, lineHeight: 1.6, color: "var(--sp-muted)", animationDelay: ".16s" }}
                        >
                            Writesea Odyssey is a React 19, Tailwind CSS v4 and React Aria component library. Every component is keyboard and screen-reader
                            ready, and your AI agents can build with it through MCP.
                        </p>
                        <div className="sp-home-rise" style={{ marginTop: 32, display: "flex", flexWrap: "wrap", gap: 12, animationDelay: ".24s" }}>
                            <Link className="sp-btn sp-btn-primary" href="/docs/base-components" style={{ minHeight: 52, padding: "0 26px", fontSize: 16 }}>
                                Browse components
                                <svg
                                    width="18"
                                    height="18"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    aria-hidden="true"
                                >
                                    <path d="M5 12h14M13 6l6 6-6 6" />
                                </svg>
                            </Link>
                            <Link
                                className="sp-btn sp-btn-ghost"
                                href="/docs/getting-started/installation"
                                style={{ minHeight: 52, padding: "0 26px", fontSize: 16 }}
                            >
                                Get started
                            </Link>
                        </div>
                        <div
                            className="sp-home-rise sp-mono"
                            style={{
                                marginTop: 28,
                                display: "inline-flex",
                                alignItems: "center",
                                gap: 12,
                                padding: "12px 16px",
                                borderRadius: 14,
                                background: "var(--sp-wash)",
                                fontSize: 13,
                                color: "var(--sp-muted)",
                                animationDelay: ".32s",
                            }}
                        >
                            <span style={{ color: "var(--sp-brand)" }}>$</span> npm install @your-job-search-genius/odyssey-ui
                        </div>
                    </div>

                    {/* 3D showcase (decorative) */}
                    <div className="sp-stage" style={{ flex: "1 1 520px", minWidth: 0 }} aria-hidden="true" inert>
                        <div className="sp-plane">
                            {/* Login card */}
                            <div className="sp-float sp-glass" style={float("40px", "0s", { left: "4%", top: 30, width: 290, padding: 22 })}>
                                <div style={{ fontWeight: 800, fontSize: 17 }}>Welcome back</div>
                                <div style={{ fontSize: 13, color: "var(--sp-subtle)", marginTop: 4 }}>Sign in to your workspace</div>
                                <div style={{ ...fieldLabel, marginTop: 16 }}>Email</div>
                                <div
                                    style={{
                                        marginTop: 6,
                                        height: 40,
                                        borderRadius: 10,
                                        border: "1px solid var(--sp-tint-line)",
                                        background: "var(--sp-surface)",
                                        display: "flex",
                                        alignItems: "center",
                                        padding: "0 12px",
                                        fontSize: 14,
                                        color: "var(--sp-ink)",
                                    }}
                                >
                                    olivia@writesea.com
                                </div>
                                <div style={{ ...fieldLabel, marginTop: 12 }}>Password</div>
                                <div
                                    style={{
                                        marginTop: 6,
                                        height: 40,
                                        borderRadius: 10,
                                        border: "2px solid var(--sp-brand)",
                                        background: "var(--sp-surface)",
                                        boxShadow: "0 0 0 4px rgba(86,59,219,.14)",
                                        display: "flex",
                                        alignItems: "center",
                                        padding: "0 12px",
                                        fontSize: 16,
                                        letterSpacing: 3,
                                    }}
                                >
                                    ••••••••
                                </div>
                                <div
                                    style={{
                                        marginTop: 16,
                                        height: 42,
                                        borderRadius: 12,
                                        background: "#563BDB",
                                        color: "#fff",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        fontWeight: 700,
                                        fontSize: 14,
                                    }}
                                >
                                    Sign in
                                </div>
                            </div>

                            {/* Select open */}
                            <div className="sp-float sp-glass" style={float("120px", "-2s", { right: "2%", top: 0, width: 240, padding: 14 })}>
                                <div style={{ fontSize: 12, fontWeight: 700, color: "var(--sp-subtle)", padding: "2px 6px 8px" }}>Team member</div>
                                <div
                                    style={{ display: "flex", alignItems: "center", gap: 10, padding: 8, borderRadius: 10, background: "var(--sp-tint-soft)" }}
                                >
                                    <span style={{ width: 26, height: 26, borderRadius: "50%", background: "var(--sp-brand-pale)" }} />
                                    <span style={{ fontSize: 14, fontWeight: 700 }}>Olivia Rhye</span>
                                    <svg
                                        style={{ marginLeft: "auto" }}
                                        width="16"
                                        height="16"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="var(--sp-brand)"
                                        strokeWidth="2.5"
                                        strokeLinecap="round"
                                    >
                                        <path d="m5 12 5 5 9-10" />
                                    </svg>
                                </div>
                                <div style={{ display: "flex", alignItems: "center", gap: 10, padding: 8 }}>
                                    <span style={{ width: 26, height: 26, borderRadius: "50%", background: "var(--sp-orb-2)" }} />
                                    <span style={{ fontSize: 14 }}>Phoenix Baker</span>
                                </div>
                                <div style={{ display: "flex", alignItems: "center", gap: 10, padding: 8 }}>
                                    <span style={{ width: 26, height: 26, borderRadius: "50%", background: "var(--sp-tint-line)" }} />
                                    <span style={{ fontSize: 14 }}>Lana Steiner</span>
                                </div>
                            </div>

                            {/* Badges + toggle */}
                            <div className="sp-float sp-glass" style={float("180px", "-4s", { right: "10%", top: 230, width: 250, padding: 16 })}>
                                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                                    <span style={{ ...pill, background: "var(--sp-tint)", color: "var(--sp-brand-ink)" }}>New</span>
                                    <span className="sp-pill-success" style={pill}>
                                        Active
                                    </span>
                                    <span className="sp-pill-warning" style={pill}>
                                        Pending
                                    </span>
                                </div>
                                <div
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                        marginTop: 14,
                                        fontSize: 14,
                                        fontWeight: 600,
                                    }}
                                >
                                    Email alerts
                                    <span
                                        style={{
                                            width: 44,
                                            height: 26,
                                            borderRadius: 999,
                                            background: "#563BDB",
                                            padding: 3,
                                            display: "flex",
                                            justifyContent: "flex-end",
                                        }}
                                    >
                                        <span style={{ width: 20, height: 20, borderRadius: "50%", background: "#fff" }} />
                                    </span>
                                </div>
                            </div>

                            {/* Chart */}
                            <div className="sp-float sp-glass" style={float("80px", "-1s", { left: "18%", top: 370, width: 260, padding: 16 })}>
                                <div style={{ fontSize: 12, fontWeight: 700, color: "var(--sp-subtle)" }}>Applications by week</div>
                                <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 90, marginTop: 12 }}>
                                    <span className="sp-bar" style={bar("50%", "var(--sp-brand-pale)", "0s")} />
                                    <span className="sp-bar" style={bar("75%", "var(--sp-brand-soft)", ".2s")} />
                                    <span className="sp-bar" style={bar("60%", "var(--sp-brand-pale)", ".4s")} />
                                    <span className="sp-bar" style={bar("95%", "var(--sp-brand)", ".6s")} />
                                    <span className="sp-bar" style={bar("70%", "var(--sp-brand-soft)", ".8s")} />
                                </div>
                            </div>

                            {/* Modal */}
                            <div className="sp-float sp-glass" style={float("220px", "-3s", { left: "40%", top: 150, width: 230, padding: 18 })}>
                                <div
                                    style={{
                                        width: 36,
                                        height: 36,
                                        borderRadius: 10,
                                        background: "#FEE4E2",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                    }}
                                >
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#D92D20" strokeWidth="2" strokeLinecap="round">
                                        <path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3" />
                                    </svg>
                                </div>
                                <div style={{ fontWeight: 800, fontSize: 15, marginTop: 10 }}>Delete project?</div>
                                <div style={{ fontSize: 13, color: "var(--sp-subtle)", marginTop: 4 }}>This can’t be undone.</div>
                                <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
                                    <span
                                        style={{
                                            flex: 1,
                                            height: 36,
                                            borderRadius: 10,
                                            border: "1px solid var(--sp-line)",
                                            background: "var(--sp-surface)",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            fontSize: 13,
                                            fontWeight: 700,
                                        }}
                                    >
                                        Cancel
                                    </span>
                                    <span
                                        style={{
                                            flex: 1,
                                            height: 36,
                                            borderRadius: 10,
                                            background: "#D92D20",
                                            color: "#fff",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            fontSize: 13,
                                            fontWeight: 700,
                                        }}
                                    >
                                        Delete
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Categories */}
                <section style={{ ...section, padding: "56px 24px" }}>
                    <h2 style={{ margin: 0, fontSize: 36, letterSpacing: "-0.02em", fontWeight: 800 }}>Start from a layer</h2>
                    <p style={{ margin: "10px 0 0", fontSize: 17, color: "var(--sp-muted)", maxWidth: 560 }}>
                        Four families, from the smallest control to complete application patterns.
                    </p>
                    <div style={{ marginTop: 32, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 20, perspective: 1200 }}>
                        {cats.map((c, i) => (
                            <Link
                                key={c.href}
                                className="sp-cat sp-glass sp-home-rise"
                                href={c.href}
                                style={{ display: "flex", flexDirection: "column", gap: 14, padding: 26, animationDelay: `${i * 0.08}s` }}
                            >
                                <span
                                    style={{
                                        width: 48,
                                        height: 48,
                                        borderRadius: 14,
                                        background: "var(--sp-tint)",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        color: "var(--sp-brand)",
                                    }}
                                >
                                    <svg
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        aria-hidden="true"
                                    >
                                        <path d={c.icon} />
                                    </svg>
                                </span>
                                <span style={{ fontSize: 20, fontWeight: 800 }}>{c.title}</span>
                                <span style={{ fontSize: 15, lineHeight: 1.55, color: "var(--sp-muted)" }}>{c.desc}</span>
                                <span style={{ marginTop: "auto", fontSize: 14, fontWeight: 700, color: "var(--sp-brand)" }}>{c.count} →</span>
                            </Link>
                        ))}
                    </div>
                </section>

                {/* AI-native */}
                <section style={{ ...section, padding: "56px 24px" }}>
                    <div
                        className="sp-glass"
                        style={{ padding: "clamp(24px, 4vw, 56px)", borderRadius: 32, display: "flex", flexWrap: "wrap", gap: 40, alignItems: "center" }}
                    >
                        <div style={{ flex: "1 1 340px", minWidth: 0 }}>
                            <div className="sp-mono" style={eyebrow}>
                                AI-NATIVE
                            </div>
                            <h2 style={h2}>
                                Built for agents.
                                <br />
                                Checked like a senior designer.
                            </h2>
                            <p style={lead}>
                                Connect the Odyssey MCP and your agent plans first, picks real library components, follows the matching checklists, then
                                validates before it calls the work done.
                            </p>
                            <Link className="sp-btn sp-btn-ghost" href="/agent-rules" style={{ marginTop: 24 }}>
                                See the agent rules
                            </Link>
                        </div>
                        <ol
                            style={{
                                flex: "1 1 460px",
                                minWidth: 0,
                                listStyle: "none",
                                margin: 0,
                                padding: 0,
                                display: "grid",
                                gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
                                gap: 14,
                                perspective: 900,
                            }}
                        >
                            {steps.map((s, i) => (
                                <li key={s.title} className="sp-step sp-glass" style={{ padding: 18, borderRadius: 18, animationDelay: `${i * 0.1}s, ${i}s` }}>
                                    <div className="sp-mono" style={{ fontSize: 12, color: "var(--sp-brand)" }}>
                                        0{i + 1}
                                    </div>
                                    <div style={{ fontWeight: 800, fontSize: 16, marginTop: 6 }}>{s.title}</div>
                                    <div style={{ fontSize: 13, color: "var(--sp-subtle)", marginTop: 4, lineHeight: 1.5 }}>{s.desc}</div>
                                </li>
                            ))}
                        </ol>
                    </div>
                </section>

                {/* Accessibility */}
                <section style={{ ...section, padding: "56px 24px 80px", display: "flex", flexWrap: "wrap", gap: 32, alignItems: "center" }}>
                    <div style={{ flex: "1 1 380px", minWidth: 0 }}>
                        <div className="sp-mono" style={eyebrow}>
                            ACCESSIBLE BY DEFAULT
                        </div>
                        <h2 style={h2}>Heard correctly, not just seen.</h2>
                        <p style={lead}>
                            Every component sits on React Aria, is audited against an NVDA screen-reader checklist, and is built to meet WCAG 2.2 AA contrast.
                            Try the switch — this is what a screen reader says.
                        </p>
                        <ul style={{ margin: "20px 0 0", padding: 0, listStyle: "none", display: "grid", gap: 10, fontSize: 15, color: "var(--sp-ink)" }}>
                            {promises.map((item) => (
                                <li key={item} style={{ display: "flex", gap: 10, alignItems: "center" }}>
                                    <Check />
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="sp-glass" style={{ flex: "1 1 420px", minWidth: 0, padding: 32, borderRadius: 28 }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
                            <span id="alerts-label" style={{ fontSize: 18, fontWeight: 700 }}>
                                Email alerts
                            </span>
                            <button
                                type="button"
                                className="sp-switch"
                                role="switch"
                                aria-checked={on}
                                aria-labelledby="alerts-label"
                                onClick={() => setOn(!on)}
                                style={{ background: on ? "#563BDB" : "#8E8BA8", justifyContent: on ? "flex-end" : "flex-start" }}
                            >
                                <span className="sp-knob" />
                            </button>
                        </div>
                        <div
                            className="sp-mono"
                            style={{
                                marginTop: 24,
                                padding: "16px 18px",
                                borderRadius: 16,
                                background: "var(--sp-code-bg)",
                                color: "var(--sp-code-ink)",
                                fontSize: 14,
                                lineHeight: 1.6,
                            }}
                            aria-live="polite"
                        >
                            <span style={{ color: "#B2B5F8" }}>NVDA ›</span> “Email alerts, switch, {on ? "on" : "off"}”
                        </div>
                    </div>
                </section>
            </main>

            <SiteFooter />
        </div>
    );
}
