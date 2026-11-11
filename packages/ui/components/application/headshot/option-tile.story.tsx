import { OptionTile, OptionTileGroup } from "@/components/application/headshot/option-tile";
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

/** Phone row (`14853:216307`): 137×177 tiles, 17px chip, every tile faded; clipped at 358px like the export. */
export const FigmaPhone = () => (
    <div data-compare className="inline-flex w-[358px] flex-col items-start gap-4 overflow-hidden bg-white p-0 pb-0.5">
        <OptionTileGroup aria-label="Style" defaultValue="b" className="gap-1.5">
            {["a", "b", "c"].map((id) => (
                <OptionTile key={id} value={id} label="Style 4" src={hair} size="sm" fade="always" />
            ))}
        </OptionTileGroup>
    </div>
);

/** Browse-all grid (`14853:216213`, first two tiles): 197×255, 16px chip, check mark on the selected tile. */
export const FigmaBrowseAll = () => (
    <div data-compare className="inline-flex flex-col items-start gap-4 bg-white p-0">
        <OptionTileGroup aria-label="Style" defaultValue="taper" className="gap-3">
            <OptionTile value="style-4" label="Style 4" src={hair} size="lg" fade="always" />
            <OptionTile value="taper" label="Taper Fade" src={hair} size="lg" fade="always" />
        </OptionTileGroup>
    </div>
);

/** A selected beard tile with Figma's later, shorter fade (64% → 75%), so the beard isn't washed out. */
export const BeardFade = () => (
    <OptionTileGroup aria-label="Beard" defaultValue="full">
        <OptionTile value="none" label="None" />
        <OptionTile value="full" label="Full Beard" src={hair} fade="always" fadeStops={[64, 75]} />
    </OptionTileGroup>
);
