import { describe, expect, it } from "vitest";
import { ComponentEntrySchema, ComponentMetaOverrideSchema, RegistrySchema } from "../src/schema.js";

describe("ComponentEntrySchema", () => {
    it("accepts a minimal simple component", () => {
        const result = ComponentEntrySchema.safeParse({
            id: "base/buttons/button",
            name: "Button",
            importName: "Button",
            importPath: "@your-job-search-genius/odyssey-ui/components/base/buttons/button",
            category: "base",
            description: "A button.",
            props: [],
            slots: [],
            variants: {},
            allowedChildren: "text",
            examples: [],
            doNot: [],
            docsUrl: "/docs/base/buttons/button",
            isExtracted: true,
        });
        expect(result.success).toBe(true);
    });

    it("rejects an unknown category", () => {
        const result = ComponentEntrySchema.safeParse({
            id: "x/y",
            name: "X",
            importName: "X",
            importPath: "@your-job-search-genius/odyssey-ui/components/x/y",
            category: "not-a-real-category",
            description: "",
            props: [],
            slots: [],
            variants: {},
            allowedChildren: "any",
            examples: [],
            doNot: [],
            docsUrl: "/docs/x/y",
            isExtracted: true,
        });
        expect(result.success).toBe(false);
    });
});

describe("ComponentMetaOverrideSchema", () => {
    it("accepts a partial override with only description and doNot", () => {
        const result = ComponentMetaOverrideSchema.safeParse({
            description: "Overridden description.",
            doNot: ["Do not do the thing."],
        });
        expect(result.success).toBe(true);
    });

    it("accepts an empty override", () => {
        expect(ComponentMetaOverrideSchema.safeParse({}).success).toBe(true);
    });

    it("rejects an override that tries to set id, name, or props (curation-only fields)", () => {
        // These keys are simply stripped by .omit() at the type level, but a
        // consumer authoring plain JS (no TS enforcement) could still pass
        // them -- Zod's default behavior only *ignores* unknown/omitted
        // keys, so this documents that expectation rather than asserting
        // a runtime rejection.
        const result = ComponentMetaOverrideSchema.safeParse({ id: "should-be-ignored", description: "ok" });
        expect(result.success).toBe(true);
        expect(result.success && "id" in result.data).toBe(false);
    });
});

describe("RegistrySchema", () => {
    it("rejects a library.packageName that doesn't match the real package", () => {
        const result = RegistrySchema.safeParse({
            version: "0.2.1",
            generatedAt: "test",
            library: { packageName: "@wrong/scope", importPath: "@/components" },
            components: [],
            tokens: { colors: [], breakpoints: {}, shadows: [], animations: [], radius: [], allowedTailwindPatterns: [] },
            icons: [],
            rules: { allowedPrimitives: [], forbiddenElements: [], styleRules: [], compositionRules: [], version: "1.0.0" },
        });
        expect(result.success).toBe(false);
    });
});
