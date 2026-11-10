export const componentMeta = {
    description:
        'Round 70px camera shutter for dark camera surfaces. Props: label (accessible name, default "Take photo"), caption (visible hint under the button), className, plus any React Aria Button prop (onPress, isDisabled...). Shrinks slightly while pressed (respects reduced motion).',
    variants: {},
    a11y: "A real button named by label (aria-label); the SVG is aria-hidden. The caption is plain text below it, not part of the name. Visible white focus outline; isDisabled dims it. Pass a localised label.",
    doNot: ["Do not use it on a light surface; the ring and fill are white.", "Do not rely on the caption as the button's name; set label."],
    examples: [
        { title: "Basic", code: '<ShutterButton caption="Click the button above to take photo" onPress={takePhoto} />' },
        { title: "Starting camera", code: '<ShutterButton caption="Starting camera…" isDisabled />' },
    ],
};
