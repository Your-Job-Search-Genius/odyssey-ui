/**
 * The contract this package exists to guarantee: treeToTsx's output
 * always passes @your-job-search-genius/ds-mcp's validateJsx() with zero
 * errors. Every fixture is round-tripped through the real validator, not
 * a mock of it -- if codegen and the validator ever disagree about what
 * "valid" means, this is where it would show up.
 */
import { validateJsx } from "@your-job-search-genius/ds-mcp";
import { loadRegistry } from "@your-job-search-genius/ds-registry";
import type { Registry } from "@your-job-search-genius/ds-registry";
import { beforeAll, describe, expect, it } from "vitest";
import { treeToTsx } from "../src/codegen.js";
import type { UITree } from "../src/schema.js";
import { buttonTree, buttonWithIconTree, selectTree } from "./fixtures.js";

let registry: Registry;
beforeAll(() => {
    registry = loadRegistry();
});

async function roundTrip(tree: UITree) {
    const code = await treeToTsx(tree, registry);
    return { code, result: validateJsx(code, registry) };
}

describe("treeToTsx: round-trips through validate_jsx with zero errors", () => {
    it("the Button fixture", async () => {
        const { code, result } = await roundTrip(buttonTree());
        expect(result.errors, code).toEqual([]);
        expect(result.ok).toBe(true);
    });

    it("the icon-accepting Button fixture", async () => {
        const { code, result } = await roundTrip(buttonWithIconTree());
        expect(result.errors, code).toEqual([]);
        expect(code).toContain('import { Check } from "@/components/foundations/icons"');
        expect(code).toContain("iconLeading={Check}"); // bare reference, not a rendered element
    });

    it("the compound Select fixture", async () => {
        const { code, result } = await roundTrip(selectTree());
        expect(result.errors, code).toEqual([]);
        expect(code).toContain('import { Select } from "@/components/base/select/select"'); // Select.Item imports via Select's root name
        expect(code).not.toContain("SelectItem"); // only the curated compound access form should appear
    });

    it("a tree with long text extracted to a const", async () => {
        const longText = "x".repeat(120);
        const tree: UITree = {
            rootId: "root",
            nodes: {
                root: { id: "root", kind: "primitive", tag: "p", className: ["text-tertiary"], children: ["t"] },
                t: { id: "t", kind: "text", value: longText },
            },
        };
        const { code, result } = await roundTrip(tree);
        expect(result.errors, code).toEqual([]);
        expect(code).toMatch(/const text_t = /);
    });

    it("a deeply nested primitive layout", async () => {
        const tree: UITree = {
            rootId: "outer",
            nodes: {
                outer: { id: "outer", kind: "primitive", tag: "div", className: ["flex", "flex-col", "gap-4"], children: ["inner"] },
                inner: { id: "inner", kind: "primitive", tag: "div", className: ["flex", "items-center", "gap-2"], children: ["heading"] },
                heading: { id: "heading", kind: "primitive", tag: "h2", className: ["text-primary"], children: ["headingText"] },
                headingText: { id: "headingText", kind: "text", value: "Settings" },
            },
        };
        const { code, result } = await roundTrip(tree);
        expect(result.errors, code).toEqual([]);
    });
});

describe("treeToTsx: determinism", () => {
    it("produces byte-identical output for the same tree across repeated calls", async () => {
        const tree = selectTree();
        const first = await treeToTsx(tree, registry);
        const second = await treeToTsx(structuredClone(tree), registry);
        expect(first).toBe(second);
    });

    it("sorts primitive className output regardless of input order", async () => {
        const treeA: UITree = { rootId: "r", nodes: { r: { id: "r", kind: "primitive", tag: "div", className: ["gap-2", "flex"], children: [] } } };
        const treeB: UITree = { rootId: "r", nodes: { r: { id: "r", kind: "primitive", tag: "div", className: ["flex", "gap-2"], children: [] } } };
        expect(await treeToTsx(treeA, registry)).toBe(await treeToTsx(treeB, registry));
    });
});

describe("treeToTsx: output shape", () => {
    it("skips the prop attribute entirely for a false boolean value, and uses shorthand for true", async () => {
        const tree: UITree = {
            rootId: "btn",
            nodes: {
                btn: {
                    id: "btn",
                    kind: "component",
                    name: "Button",
                    props: { isDisabled: { t: "boolean", v: true }, isLoading: { t: "boolean", v: false } },
                    children: [],
                },
            },
        };
        const code = await treeToTsx(tree, registry);
        expect(code).toContain("isDisabled");
        expect(code).not.toMatch(/isDisabled=\{true\}/);
        expect(code).not.toContain("isLoading");
    });

    it("uses a custom component name when given one", async () => {
        const code = await treeToTsx(buttonTree(), registry, { componentName: "LoginButton" });
        expect(code).toContain("function LoginButton()");
    });
});
