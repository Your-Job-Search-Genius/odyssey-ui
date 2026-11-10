export const componentMeta = {
    description:
        'Compact segmented progress indicator for short linear flows (2-4 steps): gray segments joined by bridges with the current step on a white pill with a progress ring. Props: steps ({ id, label }[], required), currentStep (index, required; earlier steps are completed, later ones upcoming), onStepPress(index) (makes completed steps buttons that go back), onBack (shows a back button before the stepper below md), backLabel (default "Back"), completedLabel (screen-reader suffix, default "completed"), plus nav attributes (className, aria-label overrides the default "Progress").',
    variants: {},
    a11y: 'A nav landmark (aria-label "Progress") containing an ordered list; the current step has aria-current="step". Completed and upcoming steps look alike, so completed ones get a screen-reader "(completed)" suffix, and are buttons only when onStepPress is set. The mobile back button is an icon button with an aria-label. Localise backLabel and completedLabel.',
    doNot: [
        "Do not use it for more than about 4 steps; use a different pattern for long flows.",
        "Do not make upcoming steps pressable; only completed steps become buttons.",
        "Do not use it for non-linear tabs; use Tabs.",
    ],
    examples: [
        {
            title: "Controlled",
            code: '<Stepper steps={[{ id: "photo", label: "Take Photo" }, { id: "details", label: "Details" }, { id: "style", label: "Add Style" }]} currentStep={step} onStepPress={setStep} onBack={() => setStep(step - 1)} />',
        },
        { title: "Read-only", code: "<Stepper steps={steps} currentStep={0} />" },
    ],
};
