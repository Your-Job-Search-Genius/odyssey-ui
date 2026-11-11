"use client";

import { useState } from "react";
import { Button as AriaButton } from "react-aria-components";
import { ImageAdd01Icon } from "@/components/foundations/hugeicons";
import { cx } from "@/utils/cx";

const focusRing = "cursor-pointer outline-focus-ring focus-visible:outline-2 focus-visible:outline-offset-2";

// Photo thumb box (Figma 73×58).
const THUMB_W = 73;
const THUMB_H = 58;

export interface ThumbStripCrop {
    /** Left edge of the kept square, as a fraction of the (turned) image width. */
    x: number;
    /** Top edge of the kept square, as a fraction of the (turned) image height. */
    y: number;
    /** Side of the kept square, as a fraction of the (turned) image width. */
    size: number;
}

export interface ThumbStripPhoto {
    src: string;
    alt: string;
    /** Shows only this square of the photo, centred and covering the thumb. Fractions are of the image after `rotation`. */
    crop?: ThumbStripCrop;
    /** Clockwise turn applied before `crop`. @default 0 */
    rotation?: 0 | 90 | 180 | 270;
}

export interface ThumbStripProps {
    photos: ThumbStripPhoto[];
    /** Total slots; the ones without a photo render as "Add Photo" buttons. @default photos.length */
    slots?: number;
    /** Marks the photo being cropped (white ring, `aria-current`). */
    selectedIndex?: number;
    onSelect?: (index: number) => void;
    onAdd?: () => void;
    addLabel?: string;
    className?: string;
}

/** The photo, turned and cropped to fill the thumb. Until the image reports its size it is hidden (or simply covers the thumb when uncropped). */
const ThumbImage = ({ src, alt, crop, rotation = 0 }: ThumbStripPhoto) => {
    // Natural width / height of the unturned image.
    const [aspect, setAspect] = useState<number>();
    const isTransformed = Boolean(crop || rotation);

    if (!aspect || !isTransformed) {
        return (
            <img
                src={src}
                alt={alt}
                onLoad={(event) => isTransformed && setAspect(event.currentTarget.naturalWidth / event.currentTarget.naturalHeight)}
                className={cx("size-full object-cover", isTransformed && "opacity-0")}
            />
        );
    }

    const isQuarter = rotation % 180 !== 0;
    const turnedAspect = isQuarter ? 1 / aspect : aspect;
    // No crop: the largest centred square.
    const square = crop ?? (turnedAspect > 1 ? { x: (1 - 1 / turnedAspect) / 2, y: 0, size: 1 / turnedAspect } : { x: 0, y: (1 - turnedAspect) / 2, size: 1 });
    // The turned image's box (px): the square covers the thumb and its centre sits on the thumb's centre.
    const width = Math.max(THUMB_W, THUMB_H) / square.size;
    const height = width / turnedAspect;
    const left = THUMB_W / 2 - (square.x + square.size / 2) * width;
    const top = THUMB_H / 2 - square.y * height - (square.size * width) / 2;

    return (
        <span className="absolute" style={{ left, top, width, height }}>
            <img
                src={src}
                alt={alt}
                className="absolute top-1/2 left-1/2 max-w-none"
                style={{ width: isQuarter ? height : width, height: isQuarter ? width : height, transform: `translate(-50%, -50%) rotate(${rotation}deg)` }}
            />
        </span>
    );
};

/** Row of photo thumbnails and empty slots under the crop area. */
export const ThumbStrip = ({ photos, slots = photos.length, selectedIndex, onSelect, onAdd, addLabel = "Add Photo", className }: ThumbStripProps) => (
    <div className={cx("inline-flex items-center gap-[7px] rounded-[18px] bg-black/28 p-2", className)}>
        {photos.map((photo, index) => (
            // A native button: React Aria's Button drops `aria-current`, which the ring and screen readers both rely on.
            <button
                key={index}
                type="button"
                onClick={() => onSelect?.(index)}
                aria-current={index === selectedIndex || undefined}
                className={cx(focusRing, "relative h-[58px] w-[73px] shrink-0 overflow-hidden rounded-[9px] aria-[current]:ring-2 aria-[current]:ring-white")}
            >
                <ThumbImage {...photo} />
            </button>
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
