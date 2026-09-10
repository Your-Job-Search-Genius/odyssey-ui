/**
 * `npx @your-job-search-genius/ds-mcp init`: writes MCP server config and
 * rule files into the *consuming* repo (Section 4.5's enforcement-via-
 * distribution piece -- an MCP server alone can't force an editor agent
 * to use it, so init wires the server in and drops the same rules into
 * CLAUDE.md / Cursor rules that a human contributor would read).
 *
 * Every write here is additive/idempotent: existing unrelated
 * .mcp.json / .cursor/mcp.json server entries are preserved, and the
 * CLAUDE.md / .mdc blocks are replaced in place (by marker comments) on
 * a second run rather than duplicated.
 */
import { loadRegistry } from "@your-job-search-genius/ds-registry";
import fs from "node:fs";
import path from "node:path";
import { rulesToMarkdown } from "../tools.js";

const SERVER_KEY = "writesea-ds";
const MCP_SERVER_CONFIG = { command: "npx", args: ["-y", "@your-job-search-genius/ds-mcp"] };

const CLAUDE_MD_BEGIN = "<!-- BEGIN:writesea-ds-mcp -->";
const CLAUDE_MD_END = "<!-- END:writesea-ds-mcp -->";

function readJsonIfExists(filePath: string): Record<string, unknown> {
    if (!fs.existsSync(filePath)) return {};
    try {
        return JSON.parse(fs.readFileSync(filePath, "utf8"));
    } catch {
        throw new Error(`${filePath} exists but is not valid JSON -- fix or remove it before running init again.`);
    }
}

function writeMcpServerConfig(filePath: string) {
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    const existing = readJsonIfExists(filePath);
    const mcpServers = (existing.mcpServers as Record<string, unknown> | undefined) ?? {};
    mcpServers[SERVER_KEY] = MCP_SERVER_CONFIG;
    fs.writeFileSync(filePath, `${JSON.stringify({ ...existing, mcpServers }, null, 2)}\n`);
    console.log(`[ds-mcp init] wrote ${filePath}`);
}

function upsertMarkedBlock(filePath: string, block: string) {
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    const wrapped = `${CLAUDE_MD_BEGIN}\n${block}\n${CLAUDE_MD_END}`;
    const existing = fs.existsSync(filePath) ? fs.readFileSync(filePath, "utf8") : "";
    const markerPattern = new RegExp(`${CLAUDE_MD_BEGIN}[\\s\\S]*?${CLAUDE_MD_END}`);

    const next = markerPattern.test(existing)
        ? existing.replace(markerPattern, wrapped)
        : existing.length > 0
          ? `${existing.trimEnd()}\n\n${wrapped}\n`
          : `${wrapped}\n`;

    fs.writeFileSync(filePath, next);
    console.log(`[ds-mcp init] wrote ${filePath}`);
}

function buildClaudeMdBlock(rulesMarkdown: string): string {
    return [
        "## Writesea Odyssey design system",
        "",
        "This repo has the Writesea Odyssey MCP server configured (see .mcp.json). When building UI:",
        "",
        "1. Call the `get_rules` tool first.",
        "2. Components come from the installed `@your-job-search-genius/odyssey-ui` package -- import them from `@your-job-search-genius/odyssey-ui/components/...` (each component's exact specifier is `get_component`'s importPath). Never copy component source into this repo, never import via a repo-local `@/` alias, and if the package is not installed yet, install it per the setup rules below.",
        "3. Discover real components with `list_components` / `search_components` before assuming a name exists.",
        "4. Call `validate_jsx` before presenting generated code as final. If it returns errors, fix them and call it again.",
        "",
        rulesMarkdown,
    ].join("\n");
}

function buildCursorRulesMdc(rulesMarkdown: string): string {
    return [
        "---",
        "description: Writesea Odyssey design system rules -- read before generating any UI in this repo.",
        "alwaysApply: true",
        "---",
        "",
        buildClaudeMdBlock(rulesMarkdown),
    ].join("\n");
}

export async function runInit(cwd: string) {
    const registry = loadRegistry();
    const rulesMarkdown = rulesToMarkdown(registry);

    writeMcpServerConfig(path.join(cwd, ".mcp.json"));
    writeMcpServerConfig(path.join(cwd, ".cursor", "mcp.json"));
    upsertMarkedBlock(path.join(cwd, "CLAUDE.md"), buildClaudeMdBlock(rulesMarkdown));
    fs.mkdirSync(path.join(cwd, ".cursor", "rules"), { recursive: true });
    fs.writeFileSync(path.join(cwd, ".cursor", "rules", "writesea-ds.mdc"), buildCursorRulesMdc(rulesMarkdown));
    console.log(`[ds-mcp init] wrote ${path.join(cwd, ".cursor", "rules", "writesea-ds.mdc")}`);

    console.log(`\n[ds-mcp init] Done. Restart Claude Code / Cursor (or reload MCP servers) to pick up the new configuration.`);
}
