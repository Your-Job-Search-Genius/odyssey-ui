export const componentMeta = {
    description:
        'Translucent pill button used over photos and in the crop modal. `variant` "dark" (default, for sitting on photos: "Why?", "Re-Take") or "light" (for the dark crop overlay: "Re-Upload", "Skip this photo"); `iconLeading` takes an icon component reference; children is the label. Accepts the React Aria Button props (onPress, isDisabled, aria-label, className).',
    variants: { variant: ["dark", "light"] },
    a11y: "A native button with a focus-visible outline. The icon is aria-hidden, so the text children must name the action; if you ever omit text, add aria-label. Disabled state dims to 50%.",
    doNot: [
        "Do not use it on a plain light surface -- use Button instead; the glass styling relies on a photo or dark backdrop.",
        "Do not pass an icon element to iconLeading; pass the component reference.",
    ],
    examples: [
        { title: "Dark pill with icon over a photo", code: "<GlassPill iconLeading={RefreshIcon} onPress={retake}>Re-Take</GlassPill>" },
        { title: "Light pill on the crop overlay", code: '<GlassPill variant="light" onPress={skip}>Skip this photo</GlassPill>' },
    ],
};
