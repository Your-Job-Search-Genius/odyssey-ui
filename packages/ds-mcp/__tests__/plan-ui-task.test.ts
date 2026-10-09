import { loadRegistry } from "@your-job-search-genius/ds-registry";
import { describe, expect, it } from "vitest";
import { planUiTask, routeCategories } from "../src/plan-ui-task.js";

const registry = loadRegistry();
const ids = (intent: string, extra?: string[]) => routeCategories(registry.guidelines, intent, extra).categories.map((c) => c.id);

describe("routeCategories", () => {
    it("routes a login page to forms, login, buttons plus the mandatory set", () => {
        const got = ids("Build a login page");
        expect(got).toEqual(expect.arrayContaining(["forms", "login", "buttons-and-actions", "color-contrast", "screen-readers-nvda"]));
        expect(got).not.toContain("data-tables");
    });

    it("never returns an empty plan for an intent with no keywords", () => {
        expect(ids("make it nicer")).toEqual(expect.arrayContaining(registry.guidelines.mandatory));
    });

    it("matches whole words only", () => {
        expect(ids("a platform overview")).not.toContain("forms");
        expect(ids("a table of invoices")).not.toContain("tabs-and-related-views");
    });

    it("does not treat UI vocabulary as state management or data tables", () => {
        const got = ids("a card grid with an empty state and a to-do list");
        expect(got).not.toContain("state-management-and-code-organization");
        expect(got).not.toContain("data-tables");
        expect(ids("redux store for the cart")).toContain("state-management-and-code-organization");
        expect(ids("a data grid of invoice records")).toContain("data-tables");
    });

    it("accepts extra categories by id or name and reports unknown ones", () => {
        const result = routeCategories(registry.guidelines, "page", ["Data tables", "pwa-nonsense"]);
        expect(result.categories.map((c) => c.id)).toContain("data-tables");
        expect(result.unknown).toEqual(["pwa-nonsense"]);
    });
});

describe("planUiTask", () => {
    const md = planUiTask(registry, "a login page");
    it("contains the workflow, selected rules, components, plan, and a completion record", () => {
        expect(md).toContain("## Workflow");
        expect(md).toContain("LOGIN-02");
        expect(md).toContain("SR-01");
        expect(md).toMatch(/\| LOGIN-01 \|/);
        expect(md).toContain("Not verified");
        expect(md).toMatch(/Input|Button/);
    });

    it("fits well under the ~25k-token MCP tool output limit, completion record before the rules", () => {
        expect(md.length).toBeLessThan(80_000);
        expect(md.indexOf("Completion record")).toBeLessThan(md.indexOf("## 5. Rules"));
    });

    it("stays under the limit for a many-category request and keeps the explicit defaults", () => {
        // 17 categories; the rule bodies alone are ~68 KB. 90 KB ≈ 22.5k tokens, under the ~25k default.
        const big = planUiTask(registry, "a dashboard with a data table, filters and a modal");
        expect(big.length).toBeLessThan(90_000);
        expect(big).toContain("## Explicit defaults");
        expect(big).toContain("ds://guidelines");
        expect(big).not.toContain("## Category index");
    });
});
