import * as Demos from "@/components/application/headshot/selection-tray.demo";

export default { title: "Application/Headshot/Selection tray" };

const man = new URL("./story-assets/favorite.jpg", import.meta.url).href;

export const Default = () => <Demos.SelectionTrayDemo />;

export const Empty = () => <Demos.EmptySelectionTrayDemo />;

/** `figma/selection-tray.png`: 4/4 with the CTA (the board shows the remove badge on the hovered first thumbnail). */
export const Figma = () => (
    <div data-compare className="inline-flex w-[362px] flex-col items-start gap-4 bg-white p-0">
        <Demos.SelectionTrayDemo src={man} />
    </div>
);

/** `figma/selection-empty.png`. */
export const FigmaEmpty = () => (
    <div data-compare className="inline-flex w-[361px] flex-col items-start gap-4 bg-white p-0">
        <Demos.EmptySelectionTrayDemo />
    </div>
);
