export const componentMeta = {
    description:
        'Full-width promo banner for a dashboard: headline and one action on the left, decorative art on the right. Props: title (ReactNode, required), headingLevel (2 | 3 | 4, default 2), action (ReactNode under the title, e.g. <Button color="secondary-brand" size="md">), media (decorative art, hidden below md, aria-hidden), plus section attributes (className). Unfilled with a 1px border so it sits on the page surface.',
    variants: { headingLevel: ["2", "3", "4"] },
    a11y: "A section with the title as a heading; set headingLevel to fit the page outline. The media slot is wrapped in aria-hidden and hidden below md, so it must be purely decorative.",
    doNot: [
        "Do not put informative content in media; it is aria-hidden.",
        "Do not put FractalGlass straight on the banner; give its wrapper a white (bg-primary) fill, or its overlay-blended stripes show as grey bars.",
        "Do not put more than one action in the action slot.",
        "Do not use it for validation or status messages; use Alert.",
    ],
    examples: [
        {
            title: "Headline with action",
            code: '<DashboardBanner title="Over 3 million are generating headshots. Get Yours in 3 easy steps" action={<Button color="secondary-brand" size="md" href="/headshot" iconTrailing={ArrowRight02SharpIcon}>Create Headshot</Button>} media={<Art />} />',
        },
    ],
};
