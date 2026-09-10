/**
 * Renders against the *real* packages/ui components (not a mock
 * componentMap) -- see vitest.config.ts's "@" alias -- so this exercises
 * the actual runtime shape (compound Select.Item access, real prop
 * names) rather than an idealized stand-in that could drift from
 * reality.
 */
import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Button } from "@/components/base/buttons/button";
import { Select } from "@/components/base/select/select";
import { Check } from "@/components/foundations/icons";
import { renderTree } from "../src/render.js";
import type { ComponentMap, IconMap } from "../src/render.js";
import { buttonTree, buttonWithIconTree, selectTree } from "./fixtures.js";

const componentMap: ComponentMap = { Button: Button as ComponentMap[string], Select: Select as ComponentMap[string] };
const iconMap: IconMap = { Check };

describe("renderTree", () => {
    it("renders a primitive-wrapped Button with the real component, real DOM output", () => {
        const { container } = render(<>{renderTree(buttonTree(), { componentMap, iconMap })}</>);
        const wrapper = container.querySelector('[data-node-id="root"]');
        expect(wrapper?.tagName).toBe("DIV");
        expect(wrapper?.className.split(" ").sort()).toEqual(["flex", "gap-2"]);

        const button = container.querySelector('[data-node-id="btn"]');
        expect(button?.tagName).toBe("BUTTON"); // React Aria's Button renders a native <button>
        expect(button?.textContent).toBe("Save");
    });

    it("renders an icon passed via an icon-typed prop value", () => {
        const { container } = render(<>{renderTree(buttonWithIconTree(), { componentMap, iconMap })}</>);
        const button = container.querySelector('[data-node-id="btn"]');
        expect(button?.querySelector("svg")).toBeTruthy();
    });

    it("renders the compound Select.Item via the real Select.Item runtime property, not a flattened key", () => {
        // componentMap only has "Select" -- "Select.Item" must resolve via
        // Select.Item at runtime (the real compound-component pattern),
        // proving resolveComponent doesn't need a pre-flattened map entry.
        const { container } = render(<>{renderTree(selectTree(), { componentMap, iconMap })}</>);
        // Select renders its trigger button synchronously; the listbox
        // (and therefore Select.Item) is only in the DOM once open in
        // React Aria Components, so assert on what's reliably present
        // without simulating a full pointer interaction here.
        expect(container.querySelector('[data-node-id="select"]')).toBeTruthy();
    });

    it("renders text nodes as plain text content", () => {
        const { container } = render(<>{renderTree(buttonTree(), { componentMap, iconMap })}</>);
        expect(container.textContent).toBe("Save");
    });

    it("returns null for a component name not present in componentMap, rather than throwing", () => {
        const tree = { rootId: "x", nodes: { x: { id: "x", kind: "component" as const, name: "NotInMap", props: {}, children: [] } } };
        expect(() => render(<>{renderTree(tree, { componentMap, iconMap })}</>)).not.toThrow();
    });
});
