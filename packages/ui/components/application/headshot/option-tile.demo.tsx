"use client";

import { useState } from "react";
import { Card } from "@/components/application/cards/card";
import { Carousel } from "@/components/application/carousel/carousel-base";
import { OptionTile, OptionTileGroup } from "@/components/application/headshot/option-tile";
import { Badge } from "@/components/base/badges/badges";
import { Label } from "@/components/base/input/label";
import { ArrowRight01SharpIcon } from "@/components/foundations/hugeicons";

const options = [
    { id: "none", label: "None" },
    { id: "style-1", label: "Style 1" },
    { id: "style-2", label: "Style 2" },
    { id: "style-3", label: "Style 3" },
    { id: "style-4", label: "Style 4" },
    { id: "style-5", label: "Style 5" },
];

const arrow = "rounded-sm text-fg-primary outline-focus-ring focus-visible:outline-2 disabled:opacity-50";

/** A section card holding a single-choice tile carousel; the header repeats the current choice as a value tag. */
export const OptionTileCarouselDemo = ({ label = "Eyewear", src, defaultValue = "style-2" }: { label?: string; src?: string; defaultValue?: string }) => {
    const [value, setValue] = useState(defaultValue);

    return (
        <Card variant="subtle" size="sm" className="w-full max-w-[438px]">
            <OptionTileGroup value={value} onChange={setValue} className="block">
                <Carousel.Root opts={{ align: "start" }} aria-label={`${label} options`} className="flex flex-col gap-[13px]">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                            <Label>{label}</Label>
                            <Badge type="color" color="brand" size="sm">
                                {options.find((option) => option.id === value)?.label}
                            </Badge>
                        </div>
                        <div className="flex">
                            <Carousel.PrevTrigger className={arrow}>
                                <ArrowRight01SharpIcon aria-hidden="true" className="size-5 rotate-180" />
                            </Carousel.PrevTrigger>
                            <Carousel.NextTrigger className={arrow}>
                                <ArrowRight01SharpIcon aria-hidden="true" className="size-5" />
                            </Carousel.NextTrigger>
                        </div>
                    </div>
                    <Carousel.Content className="gap-[7px]">
                        {options.map((option) => (
                            <Carousel.Item key={option.id} className="basis-auto">
                                <OptionTile value={option.id} label={option.label} src={option.id === "none" ? undefined : src} />
                            </Carousel.Item>
                        ))}
                    </Carousel.Content>
                </Carousel.Root>
            </OptionTileGroup>
        </Card>
    );
};

/** Browse-all grid: large tiles that shrink to their column, every hair image faded. */
export const OptionTileBrowseAllDemo = ({ src }: { src?: string }) => (
    <OptionTileGroup aria-label="Style" defaultValue="style-2" className="grid w-full max-w-[824px] grid-cols-2 gap-2 md:grid-cols-4 md:gap-3">
        {options.slice(1, 5).map((option) => (
            <OptionTile key={option.id} value={option.id} label={option.label} src={src} size="lg" fade="always" />
        ))}
    </OptionTileGroup>
);
