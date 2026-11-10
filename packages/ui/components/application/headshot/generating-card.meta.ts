/** generating-card.tsx exports GeneratingCard (the illustrated card) and GeneratingHeader (the title block above it). */
export const componentMeta = {
    importName: "GeneratingCard",
    description:
        'Illustrated "your headshots are being generated" card on a fixed 768px stage (centred, so narrow screens crop the sides). Props: inputs (up to three { src, alt, tag, tone?: "gray" | "purple" | "sky" }: the face photo, then two style references), logo (centre tile), captionLead ("Generating") / captionTail ("Headshot"), stages (status chips along the bottom), className. The light beams pulse unless reduced motion is on. GeneratingHeader (title, description, children, className) is the centred title block above it; children is usually an info pill.',
    a11y: "The beams, brackets and the second caption are aria-hidden. Input images use their `alt`; give each a meaningful one. The pulse animation is motion-safe only. Announce progress changes elsewhere (e.g. a live region) -- the card itself has no live region.",
    doNot: ["Do not pass more than three inputs; extras are ignored.", "Do not rely on the card to announce progress to screen readers."],
    examples: [
        {
            title: "Header and card",
            code: '<GeneratingHeader title="Learning your Face" description="Usually ready in 45-90 minutes. Safe to close - we\'ll email you." />\n<GeneratingCard\n  inputs={[\n    { src: face, alt: "Your photo", tag: "Clothes" },\n    { src: bg, alt: "Background reference", tag: "Background", tone: "purple" },\n    { src: hair, alt: "Hairstyle reference", tag: "Hairstyle", tone: "sky" },\n  ]}\n  logo={<Logo />}\n/>',
        },
    ],
};
