export const componentMeta = {
    description:
        'Bottom-centre favourites control. With count 0 it is a translucent pill (count chip + label). With favourites it becomes a dark tab tucked behind a share-for-feedback bar; with neither feedbackTitle nor onShare only the tab shows. Props: count (required), thumbnails (up to two image URLs stacked on the tab), onFavoritesPress, isFavoritesActive (set it when the tab filters the results to favourites: the tab becomes a toggle with aria-pressed), favoritesLabel ("Favorites"), feedbackTitle, onShare (renders the Share Link button only when provided), shareLabel ("Share Link"), size ("md" desktop, default | "sm" phone: frosted 50px tab over a full-width bar with a grey Share button | "responsive": sm below the md breakpoint), className.',
    variants: { size: ["md", "sm", "responsive"] },
    a11y: 'The favourites tab/pill is a button whose name is the count plus favoritesLabel; thumbnails are decorative (aria-hidden, alt=""). Pass isFavoritesActive when the tab toggles a favourites filter so its state is announced (aria-pressed), and announce the filtered result count in a live region. The share button is a normal labelled Button. Localize favoritesLabel, feedbackTitle and shareLabel.',
    doNot: [
        "Do not pass more than two thumbnails; extras are dropped.",
        "Do not pass onShare without feedbackTitle context -- the share bar only appears when count > 0.",
    ],
    examples: [
        { title: "Empty", code: "<FavoritesBar count={0} onFavoritesPress={openFavorites} />" },
        {
            title: "Phone-aware filter toggle",
            code: '<FavoritesBar\n  size="responsive"\n  count={8}\n  thumbnails={[a, b]}\n  isFavoritesActive={favoritesOnly}\n  onFavoritesPress={() => setFavoritesOnly((on) => !on)}\n  feedbackTitle="Get Feedback from Friends on your Favourites"\n  onShare={copyLink}\n/>',
        },
        {
            title: "With favourites and share",
            code: '<FavoritesBar\n  count={8}\n  thumbnails={[a, b]}\n  onFavoritesPress={openFavorites}\n  feedbackTitle="Get Feedback from Friends on your Favourites"\n  onShare={copyLink}\n/>',
        },
    ],
};
