export const componentMeta = {
    description:
        "One generated headshot, 233x261px, with a blurred glow, a favourite toggle and hover actions. Props: src, alt (both required), isFavorite + onFavoriteChange (toggle, bottom-left), onOpen (shows the expand button, bottom-centre; opens the Lightbox), onDownload (shows the download button, bottom-right), favoriteLabel/openLabel/downloadLabel (accessible names), className. Open and download appear on hover, keyboard focus within the tile and always on touch screens.",
    variants: {},
    a11y: "Favourite is a toggle button (aria-pressed via React Aria) with an aria-label; open and download are icon buttons with aria-labels, visible on focus-within so keyboard users reach them. The glow copy is aria-hidden; the main photo carries the alt text. Localise the three labels.",
    doNot: [
        "Do not drop the aria-label overrides when localising; the buttons are icon-only.",
        "Do not hide the actions behind hover only in custom wrappers; the tile already shows them on focus and touch.",
    ],
    examples: [
        {
            title: "With favourite state",
            code: '<ResultTile src={url} alt="Headshot 1" isFavorite={isFavorite} onFavoriteChange={setIsFavorite} onOpen={openLightbox} onDownload={download} />',
        },
    ],
};
