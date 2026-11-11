/**
 * lightbox.tsx exports Lightbox (the primary component) and LightboxAction, the labelled icon button for its actions slot.
 */
export const componentMeta = {
    importName: "Lightbox",
    description:
        'Full-bleed image viewer over a near-opaque frosted backdrop (a ModalOverlay with backdrop="lightbox"): the current photo on a glass card with its own colour glow, actions below it, previous/next buttons at the screen edges and a peek of the next photo. Below the md breakpoint it switches to the phone layout by itself: an edge-to-edge card with the previous/next buttons under the photo and small actions (24px icons, one-line labels in equal columns, up to three) below the card. Lightbox props: images ({ src, alt }[], required), index + onIndexChange (controlled) or defaultIndex (default 0), header (ReactNode or (index) => ReactNode, caption above the card), actions (ReactNode or (index) => ReactNode, use LightboxAction), aria-label (default "Image viewer"), closeLabel ("Close"), previousLabel ("Previous image"), nextLabel ("Next image"), positionLabel ((position, total) => string, default "Image n of total", the live-region text), plus ModalOverlay props (isOpen, onOpenChange, isDismissable...). Open it inside a DialogTrigger or with isOpen/onOpenChange. LightboxAction props: label (visible text and accessible name), icon (required), shape circle (56px round, 24px on phones; default) | square (55px tile, 24x28 on phones), isSelected (sets aria-pressed and fills the icon), plus Button press props.',
    variants: { shape: ["circle", "square"] },
    a11y: 'A modal dialog named by aria-label: focus is trapped and returns to the trigger, Escape closes, Left/Right arrows step through images. A polite live region announces positionLabel ("Image n of total" by default); each photo\'s alt text says what it is. Close, Previous image and Next image are labelled icon buttons (closeLabel/previousLabel/nextLabel; translate them with aria-label and positionLabel) (disabled at the ends); the glow and peek images are aria-hidden. LightboxAction uses aria-pressed when isSelected is set.',
    doNot: [
        "Do not render it without images or with images missing alt text.",
        "Do not build a custom full-screen modal for photos; use Lightbox.",
        "Do not use LightboxAction outside the Lightbox actions slot; it is styled for the dark glass backdrop.",
        "Do not put more than three actions in the slot; phones lay them out in equal columns on one line.",
    ],
    examples: [
        {
            title: "Controlled with favourite and download",
            code: '<Lightbox isOpen={isOpen} onOpenChange={setIsOpen} images={images} actions={(index) => (\n  <>\n    <LightboxAction label="Add to Favorite" icon={FavouriteIcon} isSelected={favourites.has(index)} onPress={() => toggle(index)} />\n    <LightboxAction label="Download" icon={ImageDownloadIcon} shape="square" />\n  </>\n)} />',
        },
    ],
};
