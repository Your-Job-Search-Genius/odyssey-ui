import type { UITree } from "../src/schema.js";

/** <div className="flex gap-2"><Button color="primary" size="md">Save</Button></div> */
export function buttonTree(): UITree {
    return {
        rootId: "root",
        nodes: {
            root: { id: "root", kind: "primitive", tag: "div", className: ["flex", "gap-2"], children: ["btn"] },
            btn: {
                id: "btn",
                kind: "component",
                name: "Button",
                props: { color: { t: "enum", v: "primary" }, size: { t: "enum", v: "md" } },
                children: ["btnText"],
            },
            btnText: { id: "btnText", kind: "text", value: "Save" },
        },
    };
}

/** <Button color="primary" iconLeading={Check}>Save</Button> */
export function buttonWithIconTree(): UITree {
    return {
        rootId: "btn",
        nodes: {
            btn: {
                id: "btn",
                kind: "component",
                name: "Button",
                props: { color: { t: "enum", v: "primary" }, iconLeading: { t: "icon", v: "Check" } },
                children: ["btnText"],
            },
            btnText: { id: "btnText", kind: "text", value: "Save" },
        },
    };
}

/** <Select label="Team"><Select.Item id="1">Olivia</Select.Item></Select> */
export function selectTree(): UITree {
    return {
        rootId: "select",
        nodes: {
            select: { id: "select", kind: "component", name: "Select", props: { label: { t: "string", v: "Team" } }, children: ["item1"] },
            item1: { id: "item1", kind: "component", name: "Select.Item", props: { id: { t: "string", v: "1" } }, children: ["item1text"] },
            item1text: { id: "item1text", kind: "text", value: "Olivia" },
        },
    };
}
