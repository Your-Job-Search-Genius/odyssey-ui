import path from "node:path";
import { describe, expect, it } from "vitest";
import { defaultHugeiconsIndexPath, defaultIconsIndexPath, extractHugeicons, extractIcons } from "../src/extract/icons.js";

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

describe("extractHugeicons", () => {
    const icons = extractHugeicons(defaultHugeiconsIndexPath(UI_ROOT));

    it("extracts the vendored set with the hugeicons import path", () => {
        expect(icons.length).toBeGreaterThan(50);
        const stars = icons.find((i) => i.name === "StarsIcon");
        expect(stars?.importPath).toBe("@your-job-search-genius/odyssey-ui/components/foundations/hugeicons");
        expect(stars?.tags).toEqual(["stars"]);
    });

    it("does not collide with the main icon set", () => {
        const main = new Set(extractIcons(defaultIconsIndexPath(UI_ROOT)).map((i) => i.name));
        expect(icons.filter((i) => main.has(i.name))).toEqual([]);
    });
});
