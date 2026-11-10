export const componentMeta = {
    description:
        'Multi-select outfit toggle (aria-pressed). Props: src and caption (required), alt, backgroundLabel ("Background:", shown while selected), backgroundSrc (thumbnail of the chosen background, shown while selected), plus React Aria ToggleButton props (isSelected/defaultSelected, onChange, isDisabled, className). Selected state adds a dark fade, the chosen background and a check over the photo. Set isDisabled on unselected cards once the selection limit is reached; they dim to 30%.',
    a11y: "A toggle button named by `caption`, exposing aria-pressed. The photo is decorative unless `alt` is given. Selection is shown by the check and background strip as well as colour. Enforce the limit with isDisabled and tell users the limit in surrounding text.",
    doNot: ["Do not use for single choice -- use a radio-based tile group.", "Do not enforce the selection limit silently; state it near the grid."],
    examples: [
        {
            title: "Limit of two selections",
            code: '<OutfitCard\n  src={photo}\n  caption="Navy Suit and White Shirt"\n  backgroundSrc={office}\n  isSelected={isSelected}\n  isDisabled={!isSelected && selected.length >= 2}\n  onChange={toggle}\n/>',
        },
    ],
};
