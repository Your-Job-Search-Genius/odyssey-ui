export const componentMeta = {
    description:
        'Row of photo thumbnails and empty "Add Photo" slots under the crop area. Props: photos ({ src, alt }[], required), slots (total slots, default photos.length; extra ones render as add buttons), selectedIndex (marks the photo being cropped with a white ring and aria-current), onSelect(index), onAdd, addLabel (default "Add Photo"), className.',
    variants: {},
    a11y: "Each thumbnail is a button named by its photo alt (give each a distinct alt); the selected one gets aria-current. Empty slots are buttons labelled addLabel. Focus outlines replace the dotted slot outline.",
    doNot: ["Do not give every photo the same alt text.", "Do not use it on a light surface; it is a translucent dark tray for dark camera/crop UI."],
    examples: [
        {
            title: "Five slots, two photos",
            code: "<ThumbStrip photos={photos} slots={5} selectedIndex={selected} onSelect={setSelected} onAdd={addPhoto} />",
        },
    ],
};
