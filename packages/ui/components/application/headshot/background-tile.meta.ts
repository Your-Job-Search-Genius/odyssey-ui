/** background-tile.tsx exports BackgroundTileGroup (the radiogroup grid) and BackgroundTile (one option). */
export const componentMeta = {
    importName: "BackgroundTile",
    description:
        "Single-choice background picker tile for the headshot flow. BackgroundTileGroup (a React Aria RadioGroup: value/onChange or defaultValue, aria-label, className) lays tiles out in 3 columns of 77px; BackgroundTile (value, label required, src, swatch, isDisabled, className) is one radio. Give it a photo with `src` or a CSS `background` (e.g. a gradient) with `swatch`. The label strip is always white because the picker surface is dark.",
    a11y: 'Renders native radios in a radiogroup; name the group with aria-label or aria-labelledby. The `label` is the option\'s accessible name; the thumbnail is decorative (alt=""). Arrow keys move and select; the selected tile gets a brand border and a visible focus ring on keyboard focus.',
    doNot: [
        "Do not omit aria-label/aria-labelledby on BackgroundTileGroup.",
        "Do not use BackgroundTile outside BackgroundTileGroup -- it is a radio and needs the group.",
        "Do not pass both src and swatch expecting a blend; src draws over swatch.",
    ],
    examples: [
        {
            title: "Photo and swatch tiles",
            code: '<BackgroundTileGroup aria-label="Background" value={value} onChange={setValue}>\n  <BackgroundTile value="office" label="Office" src={officePhoto} />\n  <BackgroundTile value="navy" label="Navy" swatch="linear-gradient(#2E3D5C, #1B2438)" />\n</BackgroundTileGroup>',
        },
    ],
};
