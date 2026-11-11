/**
 * bottom-bar.tsx exports BottomBar (the primary component) and BottomBarPill (the dark glass status pill).
 */
export const componentMeta = {
    importName: "BottomBar",
    description:
        'Mobile bottom action bar: a row of actions pinned to the bottom of the viewport (fixed, z-30; the row sits 7px above the bottom edge, as in the Figma mobile frames) over a soft white fade, clear of the home indicator via safe-area-inset-bottom. Hidden from md up; pass className="md:block" to keep it. BottomBar takes div attributes (children, className). BottomBarPill is the dark glass status pill for the bar (e.g. "Your Selection 1/1" with an info button); it takes div attributes. Leave about 6rem at the end of the page so the bar never covers the last content.',
    variants: {},
    a11y: "Plain div wrappers with no landmark role; the fade is aria-hidden and pointer-events-none so only its children are clickable. Controls inside (Button, icon buttons) must carry their own accessible names. It covers content at the bottom, so reserve space and check it at 400% zoom.",
    doNot: [
        "Do not use it on desktop layouts; it is hidden from md up unless you opt in.",
        "Do not forget bottom padding on the page; the bar overlays the last content.",
        "Do not put the primary action only here without a desktop equivalent.",
    ],
    examples: [
        {
            title: "Selection bar",
            code: '<BottomBar>\n  <BottomBarPill>Your Selection 1/1</BottomBarPill>\n  <Button size="md" iconTrailing={ArrowRight02SharpIcon}>Continue to Review</Button>\n</BottomBar>',
        },
    ],
};
