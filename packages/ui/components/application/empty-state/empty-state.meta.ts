/**
 * Registry override for EmptyState and its compound parts.
 */
export const componentMeta = {
    description:
        "Empty, no-results and error states. EmptyState (size sm|md|lg) > EmptyState.Header (pattern circle|square|grid|grid-check|none) > EmptyState.FeaturedIcon | EmptyState.Illustration | EmptyState.FileTypeIcon, then EmptyState.Content > EmptyState.Title + EmptyState.Description, then EmptyState.Footer with Buttons. Illustrations, file icons and non-default patterns load on demand, so a plain icon state stays light.",
    variants: { size: ["sm", "md", "lg"] },
    a11y: "Title renders as a heading; keep it short and say what to do next in the description. Put the primary next step (Create, Clear filters, Try again) in the footer.",
    doNot: [
        "Do not leave a list blank or show only 'No data' -- explain why and offer a next step.",
        "Do not replace a whole page with an error state when only one list failed; render the state inside that list's card and keep its filters.",
    ],
    examples: [
        {
            title: "Filter-aware no results",
            code: '<EmptyState size="sm">\n  <EmptyState.Header>\n    <EmptyState.FeaturedIcon icon={SearchLg} />\n  </EmptyState.Header>\n  <EmptyState.Content>\n    <EmptyState.Title>No campaigns match these filters</EmptyState.Title>\n    <EmptyState.Description>Try a different status or clear the filters.</EmptyState.Description>\n  </EmptyState.Content>\n  <EmptyState.Footer>\n    <Button color="secondary" onClick={clearFilters}>Clear filters</Button>\n    <Button iconLeading={Plus} onClick={create}>Create campaign</Button>\n  </EmptyState.Footer>\n</EmptyState>',
        },
    ],
};
