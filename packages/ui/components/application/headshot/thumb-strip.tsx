"use client";

import { Button as AriaButton } from "react-aria-components";
import { ImageAdd01Icon } from "@/components/foundations/hugeicons";
import { cx } from "@/utils/cx";

const focusRing = "cursor-pointer outline-focus-ring focus-visible:outline-2 focus-visible:outline-offset-2";

export interface ThumbStripProps {
    photos: { src: string; alt: string }[];
    /** Total slots; the ones without a photo render as "Add Photo" buttons. @default photos.length */
    slots?: number;
    /** Marks the photo being cropped. */
    selectedIndex?: number;
    onSelect?: (index: number) => void;
    onAdd?: () => void;
    addLabel?: string;
    className?: string;
}

/** Row of photo thumbnails and empty slots under the crop area. */
export const ThumbStrip = ({ photos, slots = photos.length, selectedIndex, onSelect, onAdd, addLabel = "Add Photo", className }: ThumbStripProps) => (
    <div className={cx("inline-flex items-center gap-[7px] rounded-[18px] bg-black/28 p-2", className)}>
        {photos.map((photo, index) => (
            <AriaButton
                key={index}
                onPress={() => onSelect?.(index)}
                aria-current={index === selectedIndex || undefined}
                className={cx(focusRing, "h-[58px] w-[73px] shrink-0 overflow-hidden rounded-[9px] aria-[current]:ring-2 aria-[current]:ring-white")}
            >
                <img src={photo.src} alt={photo.alt} className="size-full object-cover" />
            </AriaButton>
        ))}
        {Array.from({ length: Math.max(0, slots - photos.length) }, (_, index) => (
            <AriaButton
                key={`add-${index}`}
                onPress={onAdd}
                // Figma strokes this slot outside its box, so it is an outline (the focus ring replaces it).
                className="flex h-[58px] w-[74px] shrink-0 cursor-pointer flex-col items-center justify-center gap-[5px] rounded-[9px] text-xs leading-[1.3] font-medium text-white outline-2 outline-[#5B5B5B] outline-dotted focus-visible:outline-offset-2 focus-visible:outline-focus-ring focus-visible:outline-solid"
            >
                <ImageAdd01Icon aria-hidden="true" className="size-[18px] opacity-30" />
                {addLabel}
            </AriaButton>
        ))}
    </div>
);
