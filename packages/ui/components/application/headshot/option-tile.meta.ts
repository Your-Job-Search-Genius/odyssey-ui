/** option-tile.tsx exports OptionTileGroup (the radiogroup) and OptionTile (one option). */
export const componentMeta = {
    importName: "OptionTile",
    description:
        'Single-choice tile for hair style, hair texture and eyewear. OptionTileGroup (a horizontal React Aria RadioGroup: value/onChange or defaultValue, aria-label, className) holds OptionTile (value, label required, src, alt, isDisabled, className): a 109x141 tile with a preview image and the label in a chip. Works inside a Carousel: pass className="block" to the group and put tiles in Carousel.Item. Omit `src` for a "None" tile.',
    a11y: "Native radios in a horizontal radiogroup; name the group with aria-label or aria-labelledby. `label` is the accessible name; the preview image is decorative unless `alt` is passed. Arrow keys move and select; the selected tile has a brand border and keyboard focus draws an outline.",
    doNot: ["Do not use OptionTile outside OptionTileGroup.", "Do not drop the label to save space -- it is the tile's accessible name."],
    examples: [
        {
            title: "Tile group",
            code: '<OptionTileGroup aria-label="Eyewear" value={value} onChange={setValue}>\n  <OptionTile value="none" label="None" />\n  <OptionTile value="style-1" label="Style 1" src={glassesPhoto} />\n</OptionTileGroup>',
        },
    ],
};
