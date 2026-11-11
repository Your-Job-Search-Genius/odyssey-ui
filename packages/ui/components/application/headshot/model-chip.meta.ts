export const componentMeta = {
    description:
        'Chip showing which model outfits are tried on, with a button to swap it: "MODEL | avatar Name | Change". Props: name (required; e.g. "Malik" or a summary like "Showing Mix"), label ("Model", rendered uppercase), avatarSrc (omit for the text-only state), changeLabel ("Change"), onPressChange (opens the picker), size ("md" default: inner box at least 198px with the name pushed right, for desktop; "sm": hugs its content with a 25px gap, for phones; "responsive": sm below the md breakpoint, md from it), className.',
    variants: { size: ["md", "sm", "responsive"] },
    a11y: 'The Change button is aria-describedby the chip text, so screen readers hear "Change, Model Malik" instead of a bare "Change". The avatar is decorative (alt=""); the name labels it. Localize label and changeLabel.',
    doNot: [
        "Do not put the avatar's meaning only in the image; the name is the accessible content.",
        "Do not use it as a general-purpose chip -- it is specific to the model-swap pattern.",
    ],
    examples: [
        { title: "With avatar", code: '<ModelChip name="Malik" avatarSrc={malikPhoto} onPressChange={openModelPicker} />' },
        { title: "Phone and desktop", code: '<ModelChip size="responsive" name="Malik" avatarSrc={malikPhoto} onPressChange={openModelPicker} />' },
        { title: "Mixed models (no avatar)", code: '<ModelChip name="Showing Mix" onPressChange={openModelPicker} />' },
    ],
};
