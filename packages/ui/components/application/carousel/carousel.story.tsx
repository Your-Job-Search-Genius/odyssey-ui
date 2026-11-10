import type { FC } from "react";
import { Carousel } from "@/components/application/carousel/carousel-base";
import { cx } from "@/utils/cx";
import * as Carousels from "./carousel.demo";

export default {
    title: "Application/Carousels",
    decorators: [
        (Story: FC) => (
            <div className="flex min-h-screen items-center justify-center bg-primary p-8">
                <div>
                    <Story />
                </div>
            </div>
        ),
    ],
};

export const CarouselMd = () => <Carousels.CarouselMd />;
CarouselMd.storyName = "Carousel md";

export const CarouselLg = () => <Carousels.CarouselLg />;
CarouselLg.storyName = "Carousel lg";

/**
 * P19 option-tile carousel (14853:211713): header row with `Carousel.Arrows`, tiles 7px apart. The tiles here are
 * plain placeholders (the option tile itself, with its image and chip, is a separate component).
 */
export const FigmaOptionCarousel = () => (
    <div data-compare className="inline-flex flex-col items-start gap-4 bg-white p-0">
        <Carousel.Root aria-label="Eyewear" opts={{ align: "start" }} className="flex w-[438px] flex-col gap-[13px] rounded-[20px] bg-[#FAFAFA] p-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                    <span className="text-sm font-medium text-primary">Eyewear</span>
                    <span className="rounded-[3px] bg-brand-50 px-[3px] py-px text-[13px] leading-[normal] font-medium text-brand-600">Style 4</span>
                </div>
                <Carousel.Arrows />
            </div>
            <Carousel.Content className="gap-[7px]">
                {["None", "Style 4", "Style 4", "Style 5"].map((label, index) => (
                    <Carousel.Item
                        key={index}
                        className={cx(
                            "flex h-[141px] basis-[109px] items-end rounded-[10px] border bg-white p-[5px]",
                            index === 2 ? "border-brand-600" : "border-[#F2F2F2]",
                        )}
                    >
                        <span className="rounded-[3px] bg-[#F0F0F0] px-[3px] py-px text-[9px] leading-[normal] font-semibold text-black">{label}</span>
                    </Carousel.Item>
                ))}
            </Carousel.Content>
        </Carousel.Root>
    </div>
);
