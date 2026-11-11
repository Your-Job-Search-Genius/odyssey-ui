export const componentMeta = {
    description:
        'Round 70px camera shutter for dark camera surfaces. Props: label (accessible name, default "Take photo"), caption (visible hint under the button), currentStep (pose progress on the ring: 0-3 lights that quarter white and the earlier ones green, 4 = all done; unset = plain ring), stepLabel ((step, total) => string appended to the name when currentStep is set, default "photo 2 of 4"), className, plus any React Aria Button prop (onPress, isDisabled...). Shrinks slightly while pressed (respects reduced motion).',
    variants: {},
    a11y: "A real button named by label (aria-label); the SVG is aria-hidden. The caption is plain text below it, not part of the name. With currentStep the name gains the pose (Take photo, photo 3 of 4); localise stepLabel. Progress is never colour alone: done and current differ by position too, and the name carries the step. Visible white focus outline (the component sets the focus ring to white); isDisabled dims it. Pass a localised label.",
    doNot: ["Do not use it on a light surface; the ring and fill are white.", "Do not rely on the caption as the button's name; set label."],
    examples: [
        { title: "Basic", code: '<ShutterButton caption="Click the button above to take photo" onPress={takePhoto} />' },
        { title: "Pose progress", code: '<ShutterButton currentStep={pose} stepLabel={(n, total) => t("photoOf", { n, total })} onPress={capture} />' },
        { title: "Starting camera", code: '<ShutterButton caption="Starting camera…" isDisabled />' },
    ],
};
