export const componentMeta = {
    description:
        'One outfit\'s results: a header then a wrapping row of tiles. Props: eyebrow (e.g. "OUTFIT 1"), count, countLabel (word after the count, e.g. "Photos"), title, headingLevel (1-6, default 3: heading level of the title), thumbnail ({ src, alt }, optional), children (ResultTile elements), className. The count renders as a Badge type="count".',
    variants: { headingLevel: ["1", "2", "3", "4", "5", "6"] },
    a11y: 'Renders a section with a header and the title as a heading (h3 unless headingLevel says otherwise); the thumbnail needs real alt text or alt="" when decorative. Set headingLevel so the title fits the page outline (e.g. 2 under the page h1).',
    doNot: [
        "Do not put anything other than ResultTile (or equivalent tile) children in it.",
        "Do not build the count chip by hand; pass count and countLabel.",
    ],
    examples: [
        {
            title: "Basic",
            code: '<ResultGroup headingLevel={2} thumbnail={{ src: outfitUrl, alt: "" }} eyebrow="OUTFIT 1" count={2} countLabel="Photos" title="White T-Shirt and Leather Jacket">\n  <ResultTile src={a} alt="Headshot 1" onFavoriteChange={toggleA} onOpen={open} onDownload={download} />\n  <ResultTile src={b} alt="Headshot 2" isFavorite onFavoriteChange={toggleB} onOpen={open} onDownload={download} />\n</ResultGroup>',
        },
    ],
};
