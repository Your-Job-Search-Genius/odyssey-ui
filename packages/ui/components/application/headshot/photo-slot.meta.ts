export const componentMeta = {
    description:
        'One photo in the "Add Photo" grid. status empty (default; dashed Add Photo button, onAdd) | ok (photo + OK badge, optional onRetake shows a Re-Take pill) | fail (photo with red wash + Fail badge, optional onReupload (centred, 88px from the top) and whyAction slot top-right) | pending (dimmed photo under pendingLabel while it is checked). size: "md" (default, 197x261), "sm" (phone: fluid width at 183/242, smaller OK badge and Re-Take pill; put it in a grid cell), "responsive" (sm below the md breakpoint). label names the slot ("Photo 2"). Props: src, alt, addLabel/okLabel/failLabel/retakeLabel/reuploadLabel/pendingLabel (localisable strings, pendingLabel default "Checking photo…"), className. Made for dark surfaces (bg-inverse); its focus rings are white.',
    variants: { status: ["empty", "ok", "fail", "pending"], size: ["md", "sm", "responsive"] },
    a11y: 'Status is spelled out in the OK / Fail badge text, never colour alone. Actions are native buttons with visible focus outlines; decorative icons are aria-hidden. Give ok/fail slots a meaningful alt (e.g. "Photo 2"), or set label: a filled slot becomes a group named by it, the button of an empty slot is named "Add Photo, Photo 2". pendingLabel sits in a role=status region, so it is announced politely; do not announce the check a second time.',
    doNot: [
        "Do not rely on the green or red tint to convey status; the badge text carries it, so keep okLabel/failLabel set.",
        "Do not pass src without alt for an ok or fail slot.",
    ],
    examples: [
        {
            title: "The three states",
            code: '<div className="flex flex-wrap gap-3 rounded-[20px] bg-inverse p-4">\n  <PhotoSlot status="ok" src={url} alt="Photo 1" onRetake={retake} />\n  <PhotoSlot status="fail" src={url} alt="Photo 2" onReupload={reupload} whyAction={<GlassPill>Why?</GlassPill>} />\n  <PhotoSlot onAdd={add} />\n</div>',
        },
        {
            title: "Phone grid (fluid tiles below md)",
            code: '<div className="grid grid-cols-2 gap-x-1 gap-y-2 md:flex md:flex-wrap md:gap-3">\n  <PhotoSlot size="responsive" label="Photo 1" status="pending" src={url} alt="" pendingLabel="Checking photo…" />\n  <PhotoSlot size="responsive" label="Photo 2" onAdd={add} />\n</div>',
        },
    ],
};
