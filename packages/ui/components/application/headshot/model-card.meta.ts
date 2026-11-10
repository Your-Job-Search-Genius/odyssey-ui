/** model-card.tsx exports ModelCardGroup (the radiogroup grid) and ModelCard (one option). */
export const componentMeta = {
    importName: "ModelCard",
    description:
        "Single-choice model portrait for the dark model picker. ModelCardGroup (a React Aria RadioGroup: value/onChange or defaultValue, aria-label, className) lays cards out in 2 columns (4 from sm); ModelCard (value, name and src required, alt, isDisabled, className) is one radio. The portrait dissolves into the card through a radial mask; the selected card turns light blue with an inner glow and a check badge. Colours are fixed because the picker shell is always dark.",
    a11y: "Native radios in a radiogroup; name the group with aria-label or aria-labelledby. `name` is the accessible name; the portrait is decorative unless `alt` is passed. Selection is shown by the check badge and colour change, not colour alone. Arrow keys move and select; keyboard focus draws an outline.",
    doNot: [
        "Do not use ModelCard outside ModelCardGroup.",
        "Do not place ModelCardGroup on a light surface -- its colours are fixed for a dark (bg-inverse) background.",
    ],
    examples: [
        {
            title: "Model picker grid",
            code: '<ModelCardGroup aria-label="Model for outfit try-ons" value={value} onChange={setValue}>\n  <ModelCard value="malik" name="Malik" src={malikPhoto} />\n  <ModelCard value="theo" name="Theo" src={theoPhoto} />\n</ModelCardGroup>',
        },
    ],
};
