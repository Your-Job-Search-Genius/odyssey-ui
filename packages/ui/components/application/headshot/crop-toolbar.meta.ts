export const componentMeta = {
    description:
        "Frosted toolbar under the crop area. Props: zoom + onZoomChange (controlled, required), minZoom (1), maxZoom (3), zoomStep (0.01), onRotateLeft, onRotateRight, onReset (required), isResetDisabled, onReupload (optional: shows the Re-Upload pill; the phone layout never shows it, put Re-Upload in the screen's bottom bar), size (md default: one frosted toolbar; sm: Figma's phone layout, two full-width frosted pills, zoom + Reset first and rotate after; responsive: sm below the md breakpoint), plus label / rotateLeftLabel / rotateRightLabel / zoomLabel / resetLabel / reuploadLabel to localize the accessible names and button text. Rotate/zoom/reset/re-upload only call back; the toolbar does not crop or rotate anything itself. Designed for a dark overlay or a photo; focus rings inside it are white.",
    variants: { size: ["md", "sm", "responsive"] },
    a11y: 'Renders role="group" named by `label` ("Crop controls"). Rotate buttons are icon-only with aria-labels; zoom is a React Aria Slider (arrow keys, Home/End) named by `zoomLabel`. All controls show a focus-visible outline. Translate every label prop when localizing.',
    doNot: [
        "Do not show it on a light surface -- its glass styling is built for a dark overlay.",
        "Do not leave the default English labels when the surrounding UI is localized; pass the *Label props.",
    ],
    examples: [
        {
            title: "Controlled crop toolbar",
            code: "<CropToolbar\n  zoom={zoom}\n  onZoomChange={setZoom}\n  onRotateLeft={() => setRotation((r) => r - 90)}\n  onRotateRight={() => setRotation((r) => r + 90)}\n  onReset={reset}\n  isResetDisabled={zoom === 1 && rotation === 0}\n  onReupload={reupload}\n/>",
        },
        {
            title: "Phone layout below md (Re-Upload moves to the bottom bar)",
            code: '<CropToolbar size="responsive" zoom={zoom} onZoomChange={setZoom} onRotateLeft={rotateLeft} onRotateRight={rotateRight} onReset={reset} onReupload={reupload} />',
        },
    ],
};
