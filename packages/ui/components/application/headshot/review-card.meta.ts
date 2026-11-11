/**
 * ReviewCard is a compound: ReviewCard (root) with ReviewCard.Section, ReviewCard.Photo and ReviewCard.Carousel.
 */
export const componentMeta = {
    importName: "ReviewCard",
    description:
        'Review step summary: persona header then white sections. ReviewCard props: name, subtitle (e.g. "Woman"), attributes ({ label, value }[] rendered as a dl of brand Badge values; a dot trails each item so a wrapped line ends with it), action (header slot, e.g. a size="xs" color="secondary-brand" Button "Edit Details": top right from md, inline right after the subtitle on phones with the details 12px below), headingLevel (name heading, 1-6, default 3), children (ReviewCard.Section), className. ReviewCard.Section: title, count (count chip), action, headingLevel (default 4), children. ReviewCard.Photo: src, alt, className (size it; default h-[178px] w-[135px] selfie), backgroundLabel + backgroundSrc turn it into a "look" tile with a label, thumbnail and check over a bottom fade. ReviewCard.Carousel: aria-label (required), children (ReviewCard.Photo[]), prevLabel / nextLabel (arrow names, default "Previous slide" / "Next slide"), slideLabel / slideAnnouncement ((n, total) => string, see Carousel); a horizontally scrolling row that runs through the section\'s right padding to its edge (the next photo peeks), with prev/next arrows and a right-edge fade; phones show no next arrow and no fade. A native scroll row of selfies should bleed the same way: -mr-3.5 pr-3.5 with role="group", an aria-label and tabIndex={0}.',
    variants: {},
    a11y: "Section with h3/h4 headings by default; set headingLevel on ReviewCard and each ReviewCard.Section to fit the page outline (e.g. 2 and 3 under the screen h1), attributes as a description list (dt/dd), photos need alt text. ReviewCard.Carousel is a Carousel region named by its required aria-label; its arrow buttons are icon-only (named by prevLabel / nextLabel) and disabled at the ends; on phones only the prev arrow shows, swipe or the arrow keys scroll it.",
    doNot: [
        "Do not put ReviewCard.Photo directly in ReviewCard; wrap in ReviewCard.Section.",
        "Do not omit aria-label on ReviewCard.Carousel.",
        "Do not mark a photo as a look by hand; pass backgroundLabel (and backgroundSrc) to ReviewCard.Photo.",
    ],
    examples: [
        {
            title: "Persona with selfies and looks",
            code: '<ReviewCard name="Moremi Sunfyre" subtitle="Woman" attributes={[{ label: "Eye Color", value: "Blue" }]} action={<Button size="xs" color="secondary-brand">Edit Details</Button>}>\n  <ReviewCard.Section title="Selfies" count={5}>\n    <div className="flex gap-2 overflow-x-auto">\n      <ReviewCard.Photo src={selfie} alt="Selfie 1" />\n    </div>\n  </ReviewCard.Section>\n  <ReviewCard.Section title="Looks" count={12}>\n    <ReviewCard.Carousel aria-label="Looks">\n      <ReviewCard.Photo src={look} alt="Look 1" backgroundLabel="Bgd." backgroundSrc={bg} className="h-[168px] w-[134px]" />\n    </ReviewCard.Carousel>\n  </ReviewCard.Section>\n</ReviewCard>',
        },
    ],
    allowedChildren: ["ReviewCard.Section"],
};
