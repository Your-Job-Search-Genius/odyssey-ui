export const componentMeta = {
    description:
        'Dashed oval that frames the face in the selfie camera. `status` "neutral" (default, faint white), "good" (green) or "bad" (red) colours the ring; `children` is the camera feed or photo (e.g. a <video className="size-full object-cover" />), which is masked to fade out at the oval edge. Fixed 299x344 size; className for placement.',
    variants: { status: ["neutral", "good", "bad"] },
    a11y: "The ring is an aria-hidden SVG and conveys nothing on its own. Never rely on its colour for status: pair it with a visible heading or live message saying what is wrong (e.g. move closer). Give the camera feed (children) its own accessible name if it is meaningful.",
    doNot: ["Do not use status colour as the only feedback to the user.", "Do not use it for non-camera content; it is a fixed-size capture guide."],
    examples: [
        {
            title: "Good-framing state over a video",
            code: '<FaceGuideRing status="good">\n  <video ref={videoRef} className="size-full object-cover" autoPlay muted playsInline />\n</FaceGuideRing>',
        },
    ],
};
