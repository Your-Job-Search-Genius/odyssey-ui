export const componentMeta = {
    description:
        'One outfit\'s results: a header then a wrapping row of tiles. Props: eyebrow (e.g. "OUTFIT 1"), count, countLabel (word after the count, e.g. "Photos"), title, thumbnail ({ src, alt }, optional), children (ResultTile elements), className. The count renders as a Badge type="count".',
    variants: {},
    a11y: 'Renders a section with a header and an h3 title; the thumbnail needs real alt text or alt="" when decorative. Choose the surrounding heading levels so the h3 fits the page outline.',
    doNot: [
        "Do not put anything other than ResultTile (or equivalent tile) children in it.",
        "Do not build the count chip by hand; pass count and countLabel.",
    ],
    examples: [
        {
            title: "Basic",
            code: '<ResultGroup thumbnail={{ src: outfitUrl, alt: "" }} eyebrow="OUTFIT 1" count={2} countLabel="Photos" title="White T-Shirt and Leather Jacket">\n  <ResultTile src={a} alt="Headshot 1" onOpen={open} onDownload={download} />\n  <ResultTile src={b} alt="Headshot 2" isFavorite onOpen={open} onDownload={download} />\n</ResultGroup>',
        },
    ],
};
