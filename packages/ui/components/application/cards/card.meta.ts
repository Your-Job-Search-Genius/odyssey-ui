/**
 * Registry override for Card and its parts (Card.Header, Card.Media, Card.Body, Card.Footer).
 */
export const componentMeta = {
    description:
        'Content container. Card (size sm|md|lg sets padding and gap, variant outline|subtle, elevation for the outline variant, isSelected, isDisabled, isLoading, selectedLabel/loadingLabel for the screen-reader text, default "Selected"/"Loading"; renders a button when onPress is passed, a link when href is passed, else a div) > Card.Header (title, description, actions) + Card.Media (alt, aspectRatio, unavailableLabel for the broken-image placeholder, default "Image unavailable") + Card.Body + Card.Footer. variant="outline" (default) is a white card with a border, radius 20px. variant="subtle" is a borderless #FAFAFA fill with a 26px gap, for grouped sections ("section card"); its Card.Header title is one step larger (18px). A selected card shows a brand ring.',
    variants: { size: ["sm", "md", "lg"], variant: ["outline", "subtle"] },
    a11y: "An interactive Card is a native button (aria-pressed from isSelected) or link; do not nest other buttons or links inside it. isLoading sets aria-busy and shows a skeleton. Card.Header's title renders as an h3, keep heading levels in order.",
    doNot: [
        "Do not nest interactive controls inside a Card that has onPress or href.",
        'Do not use variant="subtle" for a standalone clickable tile; it has no border, so use the default outline variant.',
        "Do not hand-build a bordered rounded div for a content group -- use Card.",
    ],
    examples: [
        {
            title: "Outline card with header and footer",
            code: '<Card>\n  <Card.Header title="Team" description="Manage members." />\n  <Card.Body>{content}</Card.Body>\n  <Card.Footer><Button size="sm">Invite</Button></Card.Footer>\n</Card>',
        },
        {
            title: "Subtle section card",
            code: '<Card variant="subtle">\n  <Card.Header title="Outfits" description="Pick up to 5." />\n  <Card.Body>{tiles}</Card.Body>\n</Card>',
        },
    ],
};
