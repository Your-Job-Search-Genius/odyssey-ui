export const componentMeta = {
    description:
        'A past shoot in the Activity Library: a Card variant="subtle" size="sm" (#F8F8F8, 21px radius) with the shoot name in a white chip led by its initial, the cover photo with a soft glow, a count chip and a date; phone sizes below md (222x293 photo). Props: tag, initial (avatar letter; default the first letter of a string tag), src (optional), placeholder (shown in the photo slot when there is no src, e.g. "Generating..."), alt, count, countLabel (e.g. "Portraits"), date (pre-formatted), href (whole card is a link) or onPress (whole card is a button), className. Fills its container; cap it (e.g. max-w-[378px]).',
    variants: {},
    a11y: "With href the card is a link, with onPress a button (React Aria), so the whole card is one focus stop; give the cover a descriptive alt. The initial is decorative (aria-hidden); the name is read once. Without href or onPress it is static.",
    doNot: ["Do not nest other links or buttons inside; the card is itself the control.", "Do not pass an unformatted date; date is rendered as given."],
    examples: [
        {
            title: "Link card",
            code: '<ShootCard href="/shoots/1" tag="Shoot for Graduation" src={cover} alt="Smiling woman in a pink cardigan" count={23} countLabel="Portraits" date="Dec 2026" />',
        },
    ],
};
