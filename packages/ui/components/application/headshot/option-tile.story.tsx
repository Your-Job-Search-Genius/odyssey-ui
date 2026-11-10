import * as Demos from "@/components/application/headshot/option-tile.demo";

export default { title: "Application/Headshot/Option tile" };

const hair = new URL("./story-assets/hair.png", import.meta.url).href;

export const Default = () => <Demos.OptionTileCarouselDemo label="Hair Style" src={hair} />;

/** `figma/option-tile-carousel.png` (eyewear, third tile selected). The board's glasses photos aren't vendored, so tiles show the chip only. */
export const Figma = () => (
    <div data-compare className="inline-flex w-[438px] flex-col items-start gap-4 bg-white p-0">
        <Demos.OptionTileCarouselDemo defaultValue="style-2" />
    </div>
);

/** `figma/hair-card.png` (Hair Style row, second tile selected). */
export const FigmaHairStyle = () => (
    <div data-compare className="inline-flex w-[438px] flex-col items-start gap-4 bg-white p-0">
        <Demos.OptionTileCarouselDemo label="Hair Style" src={hair} defaultValue="style-1" />
    </div>
);
