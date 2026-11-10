import * as Demos from "@/components/application/headshot/outfit-card.demo";

export default { title: "Application/Headshot/Outfit card" };

const man = new URL("./story-assets/favorite.jpg", import.meta.url).href;

export const Default = () => <Demos.OutfitGridDemo />;

/** `figma/outfit-card-selected.png`: 240×300 photo + caption. */
export const Figma = () => (
    <div data-compare className="inline-flex flex-col items-start gap-4 bg-white p-0">
        <Demos.SelectedOutfitCardDemo src={man} />
    </div>
);
