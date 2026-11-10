import * as Demos from "@/components/application/headshot/model-card.demo";

export default { title: "Application/Headshot/Model card" };

const man = new URL("./story-assets/favorite.jpg", import.meta.url).href;

export const Default = () => <Demos.ModelCardGridDemo />;

/** `figma/model-card-selected.png`: 197×261 on the picker's #444 shell. */
export const Figma = () => (
    <div data-compare className="inline-flex flex-col items-start gap-4 bg-inverse p-0">
        <Demos.SelectedModelCardDemo src={man} />
    </div>
);
