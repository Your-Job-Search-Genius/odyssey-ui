import * as Demos from "@/components/application/headshot/background-tile.demo";

export default { title: "Application/Headshot/Background tile" };

export const Default = () => (
    <div className="bg-inverse p-6">
        <Demos.BackgroundTileGridDemo />
    </div>
);

/** `figma/bg-option-tile.png`: the selected 77×75 tile on the picker's #444 shell (the PNG keeps a little room for the shadow). */
export const Figma = () => (
    <div data-compare className="inline-flex flex-col items-start gap-4 bg-inverse p-0 pt-px pr-[5px] pb-[9px] pl-0">
        <Demos.SelectedBackgroundTileDemo />
    </div>
);

/** Phone grid from the background picker mobile frame (14853:259218): 4 columns in 370px, 90×86 tiles, gaps 3/9, on the #444 shell. */
export const FigmaPhone = () => (
    <div data-compare className="inline-flex flex-col items-start gap-4 bg-inverse p-0">
        <Demos.PhoneBackgroundTileGridDemo />
    </div>
);
