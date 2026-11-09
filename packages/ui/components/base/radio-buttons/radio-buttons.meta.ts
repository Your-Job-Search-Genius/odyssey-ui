/**
 * Registry override for RadioGroup / RadioButton (radio-buttons.tsx also exports the visual-only
 * RadioButtonBase). `importName` makes RadioGroup the entry's primary component, so its props are
 * the ones extracted -- see components.ts's pickPrimaryDoc.
 */
export const componentMeta = {
    importName: "RadioGroup",
    description:
        'Single choice from a short list. RadioGroup (size sm|md, orientation vertical|horizontal, value/onChange or defaultValue, isDisabled, aria-label) > RadioButton (value, label, hint, isDisabled). orientation="horizontal" lays radios out in a row that wraps on narrow widths. RadioButtonBase is the bare visual circle for custom rows -- it has no radio semantics on its own.',
    variants: { size: ["sm", "md"], orientation: ["vertical", "horizontal"] },
    a11y: 'Renders a radiogroup of native radios; give the group an aria-label (or aria-labelledby to a visible heading). Tab enters at the selected radio, arrow keys move and select. orientation sets aria-orientation; with "horizontal", Left/Right follow the reading direction. A RadioButton hint is exposed as its description, not part of its name.',
    doNot: [
        "Do not use RadioGroup for more than ~6 options -- use Select.",
        "Do not use RadioButtonBase as an interactive control; it is visual only. Use RadioButton inside RadioGroup.",
        'Do not lay radios out horizontally with a custom flex wrapper -- pass orientation="horizontal" so aria-orientation matches.',
    ],
    examples: [
        {
            title: "Vertical with hints",
            code: '<RadioGroup aria-label="Plan" value={plan} onChange={setPlan}>\n  <RadioButton value="basic" label="Basic" hint="Up to 10 users." />\n  <RadioButton value="business" label="Business" hint="Up to 20 users." />\n</RadioGroup>',
        },
        {
            title: "Horizontal",
            code: '<RadioGroup aria-label="Billing period" orientation="horizontal" defaultValue="monthly">\n  <RadioButton value="monthly" label="Monthly" />\n  <RadioButton value="yearly" label="Yearly" />\n</RadioGroup>',
        },
    ],
};
