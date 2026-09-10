import path from "node:path";
import { describe, expect, it } from "vitest";
import { extractTokens } from "../src/extract/tokens.js";

const UI_ROOT = path.join(import.meta.dirname, "..", "..", "ui");
const REPO_ROOT = path.join(import.meta.dirname, "..", "..", "..");

describe("extractTokens", () => {
    const tokens = extractTokens({
        themeCssPath: path.join(UI_ROOT, "styles", "theme.css"),
        claudeMdPath: path.join(REPO_ROOT, "CLAUDE.md"),
    });

    it("extracts a large, non-trivial set of color tokens", () => {
        expect(tokens.colors.length).toBeGreaterThan(50);
    });

    it("extracts known semantic classes with their real values", () => {
        const textPrimary = tokens.colors.find((c) => c.className === "text-primary");
        expect(textPrimary).toBeDefined();
        expect(textPrimary?.cssVar).toBe("--color-text-primary");
        expect(textPrimary?.value).toContain("var(--color-neutral-900)");
    });

    it("enriches known classes with CLAUDE.md's documented usage text, verbatim", () => {
        const textPrimary = tokens.colors.find((c) => c.className === "text-primary");
        expect(textPrimary?.usage).toBe("Primary text such as page headings.");
    });

    it("does not duplicate PROPERTY COLORS plumbing as separate tokens", () => {
        // "--background-color-primary" re-publishes "--color-bg-primary" into
        // Tailwind's bg- namespace; it must not appear as its own token.
        const dup = tokens.colors.find((c) => c.cssVar === "--background-color-primary");
        expect(dup).toBeUndefined();
    });

    it("captures a dark-mode override where the value actually differs", () => {
        const withDark = tokens.colors.filter((c) => c.darkValue);
        expect(withDark.length).toBeGreaterThan(0);
    });

    it("extracts breakpoints including the custom xxs/xs steps", () => {
        expect(tokens.breakpoints.xxs).toBe("320px");
        expect(tokens.breakpoints.xs).toBe("600px");
    });

    it("reports an empty radius scale rather than guessing one", () => {
        expect(tokens.radius).toEqual([]);
    });

    it("produces at least one allowedTailwindPatterns regex that matches a real color class", () => {
        const matches = tokens.allowedTailwindPatterns.some((pattern) => new RegExp(pattern).test("text-primary"));
        expect(matches).toBe(true);
    });

    it("produces patterns that reject an arbitrary-value class", () => {
        const matches = tokens.allowedTailwindPatterns.some((pattern) => new RegExp(pattern).test("bg-[#ff0000]"));
        expect(matches).toBe(false);
    });
});
