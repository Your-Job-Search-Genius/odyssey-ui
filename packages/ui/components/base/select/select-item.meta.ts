/**
 * Registry override for SelectItem, the compound child accessed as
 * `Select.Item` (not imported directly as SelectItem). Extracted props
 * still come from select-item.tsx's real props; only the compound
 * identity and nesting rule are curated here. Deliberately untyped -- see
 * button.meta.ts's doc comment for why.
 */
export const componentMeta = {
    importName: "Select.Item",
    description:
        "A single option inside Select or Select.ComboBox. Only valid as a direct child of Select's children (literal or returned from its render-prop), never used standalone.",
    allowedChildren: "text",
    allowedParents: ["base/select/select", "base/select/combobox"],
    doNot: ["Do not import or render Select.Item outside of a Select / Select.ComboBox."],
};
