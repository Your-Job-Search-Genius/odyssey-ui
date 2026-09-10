import path from "node:path";
import { describe, expect, it } from "vitest";
import { defaultIconsIndexPath, extractIcons } from "../src/extract/icons.js";

const UI_ROOT = path.join(import.meta.dirname, "..", "..", "ui");

describe("extractIcons", () => {
    const icons = extractIcons(defaultIconsIndexPath(UI_ROOT));

    it("extracts a large number of icons (the barrel has ~1180)", () => {
        expect(icons.length).toBeGreaterThan(1000);
    });

    it("extracts a known icon with the correct import path", () => {
        const activity = icons.find((i) => i.name === "Activity");
        expect(activity).toBeDefined();
        expect(activity?.importPath).toBe("@your-job-search-genius/odyssey-ui/components/foundations/icons");
    });

    it("derives searchable tags from PascalCase names", () => {
        const chevronDown = icons.find((i) => i.name === "ChevronDown");
        expect(chevronDown?.tags).toEqual(expect.arrayContaining(["chevron", "down"]));
    });

    it("has no duplicate icon names", () => {
        const names = icons.map((i) => i.name);
        expect(new Set(names).size).toBe(names.length);
    });
});
