import * as Demos from "@/components/application/headshot/capture-method-card.demo";

export default { title: "Application/Headshot/Capture method card" };

export const Default = () => <Demos.CaptureMethodsDemo />;

export const PrivacyNote = () => <Demos.PrivacyNoteDemo />;

/** `figma/capture-method-cards.png`: 393px stack, gap 10. */
export const Figma = () => (
    <div data-compare className="inline-flex w-[393px] flex-col items-start gap-4 bg-white p-0">
        <Demos.CaptureMethodsDemo />
    </div>
);
