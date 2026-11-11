/** option-tile.tsx exports OptionTileGroup (the radiogroup) and OptionTile (one option). */
export const componentMeta = {
    importName: "OptionTile",
    description:
        'Single-choice tile for hair style, hair texture and eyewear. OptionTileGroup (a horizontal React Aria RadioGroup: value/onChange or defaultValue, aria-label, className) holds OptionTile (value, label required, src, alt, isDisabled, className, size, fade, fadeStops): a tile with a preview image and the label in a chip. size: "md" (default, 109x141 persona tile), "sm" (137x177 phone tile, 17px chip), "lg" (197x255 Browse-all tile, 16px chip and a check mark when selected; shrinks to its grid column keeping the ratio), "responsive" (sm below md, md above). fade: "selected" (default, only the selected image fades towards the chip), "always" (every tile, as Figma draws hair), "none". fadeStops: [start, end] in % of the tile height, default [34, 73]; the Figma beard tile uses [64, 75]. Works inside a Carousel: pass className="block" to the group and put tiles in Carousel.Item. Omit `src` for a "None" tile.',
    a11y: "Native radios in a horizontal radiogroup; name the group with aria-label or aria-labelledby. `label` is the accessible name; the preview image is decorative unless `alt` is passed. Arrow keys move and select; the selected tile has a brand border and keyboard focus draws an outline.",
    doNot: ["Do not use OptionTile outside OptionTileGroup.", "Do not drop the label to save space -- it is the tile's accessible name."],
    examples: [
        {
            title: "Tile group",
            code: '<OptionTileGroup aria-label="Eyewear" value={value} onChange={setValue}>\n  <OptionTile value="none" label="None" />\n  <OptionTile value="style-1" label="Style 1" src={glassesPhoto} />\n</OptionTileGroup>',
        },
    ],
};
