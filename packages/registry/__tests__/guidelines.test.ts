import { describe, expect, it } from "vitest";
import { loadGuidelines, parseGuidelines } from "../src/extract/guidelines.js";
import { buildRuleSet } from "../src/extract/rules.js";

describe("guidelines", () => {
    const g = loadGuidelines();

    it("parses every category from the index, including NVDA", () => {
        const ids = g.categories.map((c) => c.id);
        expect(ids).toEqual(expect.arrayContaining(["forms", "login", "color-contrast", "screen-readers-nvda", "data-tables", "progressive-web-apps-pwa"]));
        expect(g.categories.find((c) => c.id === "screen-readers-nvda")?.markdown).toContain("SR-12");
    });

    it("keeps non-category sections in the preamble", () => {
        expect(g.preamble).toContain("## Required task workflow");
        expect(g.preamble).toContain("## Explicit defaults");
        expect(g.categories.some((c) => c.title.startsWith("Required task workflow"))).toBe(false);
    });

    it("every mandatory id and route target is a real category", () => {
        const ids = new Set(g.categories.map((c) => c.id));
        for (const id of g.mandatory) expect(ids.has(id)).toBe(true);
        for (const r of g.routes) for (const id of r.categories) expect(ids.has(id)).toBe(true);
    });

    it("fails loudly when the index lists a section that does not exist", () => {
        const md = "# T\n\n## Category index\n\n| Category | Applies when | Coverage |\n| --- | --- | --- |\n| Ghost | always | none |\n";
        expect(() => parseGuidelines(md)).toThrow(/Ghost/);
    });
});

describe("ux rules merged with guidelines", () => {
    const rules = buildRuleSet();
    const all = rules.uxSections.flatMap((s) => s.rules).join("\n");

    it("no longer owns the FORM/STATE prefixes the guidelines use", () => {
        expect(rules.uxSections.map((s) => s.id)).toEqual(expect.arrayContaining(["FIELD", "ISTATE"]));
        expect(all).not.toMatch(/\b(FORM|STATE)-\d/);
    });

    it("has an NVDA blocker and no prescribed breakpoint pixel values", () => {
        expect(all).toContain("CHK-B9");
        expect(all).not.toContain("Mobile: 0-599px");
        expect(rules.version).toBe("4.0.0");
    });
});
