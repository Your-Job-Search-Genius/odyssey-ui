/** generating-card.tsx exports GeneratingCard (the illustrated card) and GeneratingHeader (the title block above it). */
export const componentMeta = {
    importName: "GeneratingCard",
    description:
        'Illustrated "your headshots are being generated" card. From md: 768x383 on a fixed 768px stage (centred, so narrower cards crop the sides). Below md: Figma\'s phone collage, 340px tall on a 390px stage, tiles at ~1.21x, no captions, the art running 6px past the card\'s sides (give it ~6px of room, e.g. a 390px card on a 402px screen). Props: inputs (up to three { src, alt, tag, tone?: "gray" | "purple" | "sky" }: the face photo, then two style references), logo (centre tile; scaled 1.21x on phones), captionLead ("Generating") / captionTail ("Headshot"), stages (status chips, centred on the card\'s bottom border; the card adds a 12-13px bottom margin for the part that hangs below), className. The light beams pulse unless reduced motion is on. GeneratingHeader is the centred title block above it: title (keeps \\n line breaks), description, children (usually an info pill), headingLevel (1-6, default 2), id / ref / tabIndex (put on the title heading, so the app can label a region with it and focus it), className. Its title is 20px below md, 24px from md.',
    a11y: "GeneratingHeader: set headingLevel to fit the page outline (1 when it is the screen's main heading); to move focus to the title on a state change pass ref + tabIndex={-1} (it shows no focus ring, it is not a control). The beams, brackets, placeholders and the second caption are aria-hidden; phones hide both captions. Input images use their `alt`; give each a meaningful one. The pulse animation is motion-safe only. Announce progress changes elsewhere (e.g. a live region) -- the card itself has no live region.",
    doNot: ["Do not pass more than three inputs; extras are ignored.", "Do not rely on the card to announce progress to screen readers."],
    examples: [
        {
            title: "Header and card",
            code: '<GeneratingHeader headingLevel={1} id="generating-title" ref={headingRef} tabIndex={-1} title="Learning your Face" description="Usually ready in 45-90 minutes. Safe to close - we\'ll email you." />\n<GeneratingCard\n  inputs={[\n    { src: face, alt: "Your photo", tag: "Clothes" },\n    { src: bg, alt: "Background reference", tag: "Background", tone: "purple" },\n    { src: hair, alt: "Hairstyle reference", tag: "Hairstyle", tone: "sky" },\n  ]}\n  logo={<Logo />}\n  stages={<div role="group" aria-label="Progress" className="flex gap-px"><StatusBadge status="done">Learning</StatusBadge>…</div>}\n/>',
        },
    ],
};
