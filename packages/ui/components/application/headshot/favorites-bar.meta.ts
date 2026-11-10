export const componentMeta = {
    description:
        'Bottom-centre favourites control. With count 0 it is a translucent pill (count chip + label). With favourites it becomes a dark tab tucked behind a share-for-feedback bar. Props: count (required), thumbnails (up to two image URLs stacked on the tab), onFavoritesPress, favoritesLabel ("Favorites"), feedbackTitle, onShare (renders the Share Link button only when provided), shareLabel ("Share Link"), className.',
    a11y: 'The favourites tab/pill is a button whose name is the count plus favoritesLabel; thumbnails are decorative (aria-hidden, alt=""). The share button is a normal labelled Button. Localize favoritesLabel, feedbackTitle and shareLabel.',
    doNot: [
        "Do not pass more than two thumbnails; extras are dropped.",
        "Do not pass onShare without feedbackTitle context -- the share bar only appears when count > 0.",
    ],
    examples: [
        { title: "Empty", code: "<FavoritesBar count={0} onFavoritesPress={openFavorites} />" },
        {
            title: "With favourites and share",
            code: '<FavoritesBar\n  count={8}\n  thumbnails={[a, b]}\n  onFavoritesPress={openFavorites}\n  feedbackTitle="Get Feedback from Friends on your Favourites"\n  onShare={copyLink}\n/>',
        },
    ],
};
