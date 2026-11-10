"use client";

import { useState } from "react";
import { Button } from "@/components/base/buttons/button";
import { FavouriteIcon, ImageDownloadIcon } from "@/components/foundations/hugeicons";
import { Lightbox, LightboxAction } from "./lightbox";

const images = [
    { src: "https://www.untitledui.com/images/avatars/lana-steiner?fm=webp&q=80", alt: "Headshot 1: smiling, soft light" },
    { src: "https://www.untitledui.com/images/avatars/demi-wilkinson?fm=webp&q=80", alt: "Headshot 2: looking to the side" },
    { src: "https://www.untitledui.com/images/avatars/natali-craig?fm=webp&q=80", alt: "Headshot 3: straight on" },
];

/** Stand-in for the result group's header chip (owned by the results components). */
const HeaderChip = () => (
    <div className="flex items-center gap-2.5 rounded-[10px] bg-white py-1 pr-5 pl-1">
        <img src={images[0].src} alt="" className="size-10 rounded-md object-cover" />
        <div className="flex flex-col text-sm/[normal]">
            <span className="text-tertiary">OUTFIT 1 · 2 Photos</span>
            <span className="font-semibold text-primary">White T-Shirt and Leather Jacket</span>
        </div>
    </div>
);

export const LightboxDemo = ({ defaultOpen }: { defaultOpen?: boolean }) => {
    const [isOpen, setIsOpen] = useState(!!defaultOpen);
    const [favourites, setFavourites] = useState<Set<number>>(new Set());

    const toggle = (index: number) =>
        setFavourites((current) => {
            const next = new Set(current);
            if (!next.delete(index)) next.add(index);
            return next;
        });

    return (
        <>
            <Button size="md" onPress={() => setIsOpen(true)}>
                Expand image
            </Button>
            <Lightbox
                isOpen={isOpen}
                onOpenChange={setIsOpen}
                images={images}
                header={<HeaderChip />}
                actions={(index) => (
                    <>
                        <LightboxAction label="Add to Favorite" icon={FavouriteIcon} isSelected={favourites.has(index)} onPress={() => toggle(index)} />
                        <LightboxAction label="Download" icon={ImageDownloadIcon} shape="square" />
                    </>
                )}
            />
        </>
    );
};
