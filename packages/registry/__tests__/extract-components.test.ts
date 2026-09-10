import path from "node:path";
import { describe, expect, it } from "vitest";
import { extractComponents } from "../src/extract/components.js";

const UI_ROOT = path.join(import.meta.dirname, "..", "..", "ui");

describe("extractComponents", () => {
    // One batched docgen parse over the whole library -- shared across
    // every test in this file via vitest's module-level await, not
    // re-run per test (see writeProps's own comment on why batching
    // matters: a fresh TS program per call is very slow at this scale).
    const resultPromise = extractComponents({
        componentsRoot: path.join(UI_ROOT, "components"),
        uiTsconfigPath: path.join(UI_ROOT, "tsconfig.json"),
        docsUrlFor: (id) => `/docs/${id}`,
    });

    it("extracts a simple, icon-accepting component (Button) with its meta.ts override applied", async () => {
        const { components } = await resultPromise;
        const button = components.find((c) => c.id === "base/buttons/button");
        expect(button).toBeDefined();
        expect(button?.name).toBe("Button");
        expect(button?.isExtracted).toBe(true);
        // From button.meta.ts:
        expect(button?.allowedChildren).toBe("text");
        expect(button?.doNot.length).toBeGreaterThan(0);
        // From react-docgen-typescript, not the override:
        const iconLeading = button?.props.find((p) => p.name === "iconLeading");
        expect(iconLeading).toBeDefined();
        expect(iconLeading?.acceptsIcon).toBe(true);
        const sizeProp = button?.props.find((p) => p.name === "size");
        expect(sizeProp?.required).toBe(false);
        // Regression: Button's real prop type is `ButtonProps | LinkProps`
        // (a union) -- href only exists on LinkProps, but
        // react-docgen-typescript flattens both members onto one prop
        // list and reports href as globally required. button.meta.ts's
        // propOverrides corrects this; without it, every plain
        // `<Button>...</Button>` (the overwhelmingly common case) would
        // fail validate_jsx's required-prop check.
        const hrefProp = button?.props.find((p) => p.name === "href");
        expect(hrefProp?.required).toBe(false);
    });

    it("extracts a compound parent (Select) linked to its child via meta.ts", async () => {
        const { components } = await resultPromise;
        const select = components.find((c) => c.id === "base/select/select");
        expect(select).toBeDefined();
        expect(select?.compound).toEqual({ parent: "Select", children: ["base/select/select-item"] });
        // Regression: react-docgen-typescript mangles Select's displayName
        // to "_Select" (observed collision in the batched parse across
        // ~110 files) -- unmangleDisplayName must recover the real name,
        // or every <Select> in agent-generated code would be rejected as
        // an unknown component.
        expect(select?.name).toBe("Select");
        expect(select?.importName).toBe("Select");
    });

    it("extracts the compound child (SelectItem) with its curated importName and allowedParents", async () => {
        const { components } = await resultPromise;
        const selectItem = components.find((c) => c.id === "base/select/select-item");
        expect(selectItem).toBeDefined();
        expect(selectItem?.importName).toBe("Select.Item");
        expect(selectItem?.allowedParents).toContain("base/select/select");
        // The real extracted name (from docgen) is still SelectItem, even
        // though the curated importName is "Select.Item".
        expect(selectItem?.name).toBe("SelectItem");
    });

    it("excludes the internal category entirely", async () => {
        const { components } = await resultPromise;
        expect(components.some((c) => c.id.startsWith("internal/"))).toBe(false);
    });

    it("excludes icon-heavy groups from component extraction", async () => {
        const { components } = await resultPromise;
        expect(components.some((c) => c.id.startsWith("foundations/icons/"))).toBe(false);
    });

    it("has no duplicate ids", async () => {
        const { components } = await resultPromise;
        const ids = components.map((c) => c.id);
        expect(new Set(ids).size).toBe(ids.length);
    });
});
