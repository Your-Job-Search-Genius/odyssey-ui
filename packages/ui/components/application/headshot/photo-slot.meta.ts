export const componentMeta = {
    description:
        'One photo in the "Add Photo" grid, 197x261px. status empty (default; dashed Add Photo button, onAdd) | ok (photo + OK badge, optional onRetake shows a Re-Take pill) | fail (photo with red wash + Fail badge, optional onReupload and whyAction slot top-right). Props: src, alt, addLabel/okLabel/failLabel/retakeLabel/reuploadLabel (localisable strings), className. Made for dark surfaces (bg-inverse).',
    variants: { status: ["empty", "ok", "fail"] },
    a11y: 'Status is spelled out in the OK / Fail badge text, never colour alone. Actions are native buttons with visible focus outlines; decorative icons are aria-hidden. Give ok/fail slots a meaningful alt (e.g. "Photo 2").',
    doNot: [
        "Do not rely on the green or red tint to convey status; the badge text carries it, so keep okLabel/failLabel set.",
        "Do not pass src without alt for an ok or fail slot.",
    ],
    examples: [
        {
            title: "The three states",
            code: '<div className="flex flex-wrap gap-3 rounded-[20px] bg-inverse p-4">\n  <PhotoSlot status="ok" src={url} alt="Photo 1" onRetake={retake} />\n  <PhotoSlot status="fail" src={url} alt="Photo 2" onReupload={reupload} whyAction={<GlassPill>Why?</GlassPill>} />\n  <PhotoSlot onAdd={add} />\n</div>',
        },
    ],
};
