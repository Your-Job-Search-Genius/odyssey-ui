/**
 * Registry override for DescriptionList. See packages/registry/src/schema.ts's
 * ComponentMetaOverrideSchema for the full shape.
 */
export const componentMeta = {
    description:
        'Label/value metadata (record details, settings summaries) rendered as a semantic <dl>. Compound: DescriptionList holds DescriptionList.Item entries, each with a `term` and a value as children. Layouts: stacked or inline; 1-3 responsive columns; optional dividers. variant="summary" is the compact receipt look (e.g. a booking summary): a white card of uppercase keys and right-aligned values on a gray tray, with an optional `footer` node (icon + note) under it; it ignores layout, columns and isDivided.',
    allowedChildren: ["DescriptionList.Item"],
    variants: { layout: ["stacked", "inline"], columns: ["1", "2", "3"], variant: ["default", "summary"] },
    a11y: "Renders dl/dt/dd, so screen readers announce each value with its term. Empty values render an em dash instead of nothing.",
    doNot: [
        "Do not build label/value pairs from a div grid of Caption + Text -- use DescriptionList so the term/value relationship is exposed.",
        "Do not put interactive form fields inside -- DescriptionList is for read-only values. Use Form controls for editing.",
    ],
    examples: [
        {
            title: "Record details, two columns",
            code: '<DescriptionList columns={2}>\n  <DescriptionList.Item term="Sender">outreach@example.com</DescriptionList.Item>\n  <DescriptionList.Item term="Audience">1,284 contacts</DescriptionList.Item>\n</DescriptionList>',
        },
        {
            title: "Settings summary, inline with dividers",
            code: '<DescriptionList layout="inline" isDivided>\n  <DescriptionList.Item term="Throttle">40 emails / minute</DescriptionList.Item>\n</DescriptionList>',
        },
        {
            title: "Summary receipt with footer",
            code: '<DescriptionList variant="summary" footer={<><ShieldCheck data-icon />100% money-back on eligible packages</>}>\n  <DescriptionList.Item term="Package">Pro</DescriptionList.Item>\n  <DescriptionList.Item term="Total">$29</DescriptionList.Item>\n</DescriptionList>',
        },
    ],
};
