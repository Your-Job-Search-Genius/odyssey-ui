import * as Demos from "@/components/application/headshot/model-chip.demo";

export default { title: "Application/Headshot/Model chip" };

const man = new URL("./story-assets/favorite.jpg", import.meta.url).href;

export const Default = () => <Demos.ModelChipDemo />;

export const Mix = () => <Demos.MixDemo />;

/** `figma/model-chip.png`. */
export const Figma = () => (
    <div data-compare className="inline-flex flex-col items-start gap-4 bg-white p-0">
        <Demos.ModelChipDemo avatarSrc={man} />
    </div>
);
