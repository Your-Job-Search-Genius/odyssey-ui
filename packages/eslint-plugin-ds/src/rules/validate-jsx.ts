/**
 * The ESLint rule wrapping @your-job-search-genius/ds-mcp's validate_jsx
 * (design system plan, Section 4.5, item 2): "An ESLint plugin ...
 * wrapping the same validator, so violations fail lint and CI even if
 * the agent ignored the MCP." No validation logic lives here -- this is
 * a thin adapter from ValidationIssue[] to ESLint's report() shape, so
 * this rule and the validate_jsx MCP tool can never disagree about what
 * counts as a violation.
 *
 * Meant to be applied via an ESLint config `files` glob targeting
 * specifically agent-generated output (e.g. a playground export
 * directory), not a whole existing codebase -- almost any ordinary
 * React file (importing from "react", using hooks, rendering something
 * outside this component library) will fail this validator by design,
 * since that is exactly the constraint it exists to enforce.
 */
import { validateJsx } from "@your-job-search-genius/ds-mcp";
import { loadRegistry } from "@your-job-search-genius/ds-registry";
import type { Rule } from "eslint";

// Loaded once at plugin-load time, not per file -- @your-job-search-genius/ds-registry's
// default loadRegistry() is a static, build-time-bundled JSON import (see
// that package's index.ts), so this never touches the filesystem at lint time.
const registry = loadRegistry();

interface RuleOptions {
    /** Forwarded to validate_jsx's own `strict` option. Defaults to true (no auto-fix suggestions surfaced). */
    strict?: boolean;
}

export const validateJsxRule: Rule.RuleModule = {
    meta: {
        type: "problem",
        docs: {
            description:
                "Validates that TSX only uses approved Writesea Odyssey components, the allowed HTML primitives, and token-backed Tailwind classes -- the same check as the validate_jsx MCP tool.",
        },
        schema: [{ type: "object", properties: { strict: { type: "boolean" } }, additionalProperties: false }],
        messages: { violation: "{{message}}" },
    },
    create(context) {
        return {
            Program() {
                const code = context.sourceCode.getText();
                const options = context.options[0] as RuleOptions | undefined;

                const result = validateJsx(code, registry, { strict: options?.strict ?? true });
                for (const error of result.errors) {
                    context.report({
                        // ESLint's manual `loc` is 0-indexed on the column; validate_jsx's
                        // ValidationIssue.column is 1-indexed (see ds-mcp/src/validator.ts's
                        // `locate()`), so this converts rather than reusing the raw value.
                        loc: { line: error.line, column: Math.max(0, error.column - 1) },
                        messageId: "violation",
                        data: { message: error.message },
                    });
                }
            },
        };
    },
};
