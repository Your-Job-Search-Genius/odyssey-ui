/** capture-method-card.tsx exports CaptureMethodCard and CapturePrivacyNote (the lock + reassurance line under the options). */
export const componentMeta = {
    importName: "CaptureMethodCard",
    description:
        'One way to add photos (webcam, phone). The whole card is a single button or link: pass exactly one of `onPress` or `href`. `layout` "featured" (tall grey card, large decorative `icon` on top) or "compact" (short brand-tinted row). Props: title, description, icon, tab (a "Recommended" badge glued above the card), isDisabled, className. CapturePrivacyNote (children, className) renders a lock icon with a one-line privacy note.',
    variants: { layout: ["featured", "compact"] },
    a11y: "Built on Card, so it is one button/link with title and description as its name. `tab` text is exposed as the card's description (aria-describedby) while the visible badge is aria-hidden. The icon and arrow are aria-hidden; keep the title self-explanatory.",
    doNot: ["Do not pass both onPress and href.", "Do not put interactive elements in title, description or icon -- the whole card is already the control."],
    examples: [
        {
            title: "Featured with recommended tab",
            code: '<CaptureMethodCard tab="Recommended" icon={<FaceScanMark />} title="Computer Webcam" description="See your framing and get guidance before every shot" onPress={openWebcam} />',
        },
        {
            title: "Compact row and privacy note",
            code: '<CaptureMethodCard layout="compact" title="Use Phone Camera" description="Scan a code to capture or upload." onPress={openQr} />\n<CapturePrivacyNote>Photos stay private and encrypted in transit</CapturePrivacyNote>',
        },
    ],
};
