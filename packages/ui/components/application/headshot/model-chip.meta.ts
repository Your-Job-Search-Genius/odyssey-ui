export const componentMeta = {
    description:
        'Chip showing which model outfits are tried on, with a button to swap it: "MODEL | avatar Name | Change". Props: name (required; e.g. "Malik" or a summary like "Showing Mix"), label ("Model", rendered uppercase), avatarSrc (omit for the text-only state), changeLabel ("Change"), onPressChange (opens the picker), className.',
    a11y: 'The Change button is aria-describedby the chip text, so screen readers hear "Change, Model Malik" instead of a bare "Change". The avatar is decorative (alt=""); the name labels it. Localize label and changeLabel.',
    doNot: [
        "Do not put the avatar's meaning only in the image; the name is the accessible content.",
        "Do not use it as a general-purpose chip -- it is specific to the model-swap pattern.",
    ],
    examples: [
        { title: "With avatar", code: '<ModelChip name="Malik" avatarSrc={malikPhoto} onPressChange={openModelPicker} />' },
        { title: "Mixed models (no avatar)", code: '<ModelChip name="Showing Mix" onPressChange={openModelPicker} />' },
    ],
};
