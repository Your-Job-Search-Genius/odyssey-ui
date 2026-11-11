/**
 * model-switcher.tsx exports ModelSwitcher (the primary component) and ModelSwitcherOption.
 */
export const componentMeta = {
    importName: "ModelSwitcher",
    description:
        'One-tap strip choosing who wears the outfit previews (the headshot fitting room): a visible uppercase label over a grey rounded strip of 64px options, each a 40px round portrait with the name under it; usually a "Mix" option first. The selected option sits on a white tile with a brand ring around its portrait and a semibold name. Scrolls sideways when it runs out of room. ModelSwitcher props: label (ReactNode, required; names the radio group), value / defaultValue / onChange (the option values, React Aria RadioGroup), isDisabled, className, children (ModelSwitcherOption). ModelSwitcherOption props: value (required), name (required; visible text and accessible name), src (the portrait), srcs (the mix: up to three portraits side by side in the circle, instead of src), isDisabled, className.',
    variants: {},
    a11y: "A React Aria radio group named by its visible label; arrow keys move the selection, Tab enters and leaves it. Each option's name is its accessible name; portraits are decorative (aria-hidden). Selection is shown by the white tile, the brand ring and the bold name, never colour alone. Options are positioned, so the hidden native input stays inside them and focusing one never scrolls a parent.",
    doNot: [
        "Do not use it for more than about ten people; a longer list belongs in a picker dialog (ModelCardGroup).",
        "Do not leave out the visible label; it names the group for screen readers.",
        "Do not put text on the portraits; the name under them is the label.",
    ],
    examples: [
        {
            title: "Mix first, then the people",
            code: '<ModelSwitcher label="Who wears the outfits" value={modelId ?? "mix"} onChange={(id) => setModelId(id === "mix" ? null : id)}>\n  <ModelSwitcherOption value="mix" name="Mix" srcs={[malik, owen, vikram]} />\n  {models.map((m) => <ModelSwitcherOption key={m.id} value={m.id} name={m.name} src={m.portrait} />)}\n</ModelSwitcher>',
        },
    ],
};
