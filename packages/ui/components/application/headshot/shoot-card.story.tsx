import * as Demos from "@/components/application/headshot/shoot-card.demo";

export default { title: "Application/Headshot/Shoot card" };

const face = new URL("./story-assets/face.jpg", import.meta.url).href;

export const Default = () => <Demos.ShootCardDemo />;

export const ActivityLibrary = () => <Demos.ActivityLibraryDemo />;

/** `figma/shoot-card.png`: 378×423. */
export const Figma = () => (
    <div data-compare className="inline-flex w-[378px] flex-col items-start gap-4 bg-white p-0">
        <Demos.ShootCardDemo src={face} />
    </div>
);
