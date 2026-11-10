/**
 * Registry override for the badge family (Badge, BadgeWithDot, BadgeWithIcon, BadgeWithImage, BadgeWithFlag,
 * BadgeWithButton, BadgeIcon and StatusBadge, all exported from badges.tsx).
 */
export const componentMeta = {
    importName: "Badge",
    description:
        'Status/label chip. Badge (type, size sm|md|lg, color, wrap). Base types: pill-color (default), color, modern -- they take a color (gray, brand, error, warning, success, slate, sky, blue, indigo, purple, pink, rose, orange). BetterShot recipe types are complete looks and ignore color (except generating): shoot (uppercase shoot tag), option (chip on an option tile, 9px; size="lg" is the larger Browse-all chip), count (count chip next to a heading, e.g. "Headshots 32"), generating (7px input tags on the generating card; color gray|purple|sky), recommended (gradient tab that sits on a card\'s top edge, rounded top corners only). The color type at size sm is the 13px value tag; brand is a flat violet tint with no ring. StatusBadge (status done|active|pending, statusLabel, children) is the progress step chip: done = green check, active = violet with a spinning ring (static under reduced motion), pending = gray dashed ring. Also exported: BadgeWithDot, BadgeWithIcon, BadgeWithImage, BadgeWithFlag, BadgeWithButton, BadgeIcon.',
    variants: {
        type: ["pill-color", "color", "modern", "shoot", "option", "count", "generating", "recommended"],
        size: ["sm", "md", "lg"],
        color: ["gray", "brand", "error", "warning", "success", "slate", "sky", "blue", "indigo", "purple", "pink", "rose", "orange"],
    },
    a11y: 'Badges are plain text spans, not interactive. StatusBadge appends screen-reader-only status text ("completed", "in progress", "not started") after its label; pass statusLabel to localize it. Do not rely on color alone to carry meaning -- the label text must say it.',
    doNot: [
        "Do not use a Badge as a button; use Button or BadgeWithButton for a dismiss control.",
        "Do not pass color to the shoot, option, count or recommended types -- they have a fixed look.",
        "Do not build step progress from colored spans -- use StatusBadge.",
    ],
    examples: [
        { title: "Basic", code: '<Badge color="brand" size="md">New</Badge>' },
        { title: "Shoot tag", code: '<Badge type="shoot">Shoot for graduation</Badge>' },
        { title: "Count chip", code: '<Badge type="count">32</Badge>' },
        { title: "Step status", code: '<StatusBadge status="active">Shooting</StatusBadge>' },
    ],
};
