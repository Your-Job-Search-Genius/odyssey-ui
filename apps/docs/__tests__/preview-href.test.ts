import { describe, expect, it } from "vitest";
import { isRenderableDemo, parsePreviewSlug, previewHref } from "../lib/preview-href";

describe("preview href", () => {
    it("round-trips demo ids with slashes", () => {
        const href = previewHref("base/buttons/buttons", "Primary");
        expect(href.endsWith("/preview/base/buttons/buttons/Primary")).toBe(true);
        expect(parsePreviewSlug(["base", "buttons", "buttons", "Primary"])).toEqual({ demo: "base/buttons/buttons", exportName: "Primary" });
    });

    it("rejects slugs too short to name a demo and export", () => {
        expect(parsePreviewSlug(["Primary"])).toBeNull();
    });
});

describe("isRenderableDemo", () => {
    it("accepts components and rejects Storybook story objects", () => {
        expect(isRenderableDemo(() => null)).toBe(true);
        expect(isRenderableDemo({ args: {}, render: () => null })).toBe(false);
        expect(isRenderableDemo(undefined)).toBe(false);
    });
});
