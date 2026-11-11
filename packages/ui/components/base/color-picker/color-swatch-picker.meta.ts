/**
 * Registry override for ColorSwatchPicker / ColorSwatchPickerItem (color-swatch-picker.tsx).
 */
export const componentMeta = {
    importName: "ColorSwatchPicker",
    description:
        'Single choice from a set of colors. ColorSwatchPicker (size md|lg, layout grid|stack|tile, value/onChange or defaultValue) > ColorSwatchPickerItem (color, label, fill, aria-label, isDisabled). size="md" (default): 36px circles in a wrapping row; the selected one shows a centre dot (dark on light swatches). size="lg": 48px discs inside a 2px ring that turns violet when selected, in a grid of equal columns. layout="tile": the phone grid, three columns of bordered white tiles (41px circle over a Medium 14 label); the selected tile gets a brand border plus the centre dot; size is ignored. Item label is a visible caption under the swatch (also the accessible name when it is a string, else the generated color name). Item fill is a CSS `background` painted instead of the flat color (e.g. a radial gradient); color stays the value.',
    variants: { size: ["md", "lg"], layout: ["grid", "stack", "tile"] },
    a11y: "Renders a listbox of swatches; arrow keys move and select. Each item is named by aria-label, else its string label, else the generated color name. When using fill, still pass a label or aria-label that says what the color is.",
    doNot: [
        "Do not rely on the swatch color alone to convey its meaning -- add a label.",
        "Do not use ColorSwatchPicker for free-form colors; use ColorPicker.",
    ],
    examples: [
        {
            title: "Large with labels",
            code: '<ColorSwatchPicker size="lg" aria-label="Background" value={bg} onChange={setBg}>\n  <ColorSwatchPickerItem color="#F5F5F5" label="Studio" />\n  <ColorSwatchPickerItem color="#101419" label="Charcoal" />\n</ColorSwatchPicker>',
        },
        {
            title: "Gradient fill",
            code: '<ColorSwatchPickerItem color="#8571FF" label="Aurora" fill="radial-gradient(circle, #5215FF, #B9CDFF)" />',
        },
    ],
};
