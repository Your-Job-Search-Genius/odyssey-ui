/**
 * Registry override for Select -- the compound parent. See
 * select-item.meta.ts for the corresponding child override. Deliberately
 * untyped -- see button.meta.ts's doc comment for why.
 */
export const componentMeta = {
    description:
        "Dropdown selection field. children must be either a single render function `(item) => <Select.Item .../>` when items is provided, or one or more literal Select.Item children. Use Select.ComboBox instead when the list needs to be searchable.",
    allowedChildren: ["base/select/select-item"],
    compound: {
        parent: "Select",
        children: ["base/select/select-item"],
    },
    a11y: "label is required for a real accessible name; placeholder text alone is not an accessible label. isRequired reflects required state to assistive tech automatically.",
    doNot: [
        "Do not use a raw HTML <select> -- always use this component (or Select.ComboBox for a searchable variant).",
        "Do not put anything other than Select.Item (directly, or returned from the items render-prop) inside Select's children.",
    ],
    examples: [
        {
            title: "Basic",
            code: '<Select label="Team member" placeholder="Select member" items={users}>\n  {(item) => (\n    <Select.Item id={item.id} supportingText={item.email}>\n      {item.name}\n    </Select.Item>\n  )}\n</Select>',
        },
    ],
};
