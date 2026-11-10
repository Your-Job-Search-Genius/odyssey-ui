"use client";

import { Button as AriaButton, ToggleButton as AriaToggleButton } from "react-aria-components";
import { FavouriteIcon, ImageDownloadIcon, SquareArrowExpand01SharpIcon } from "@/components/foundations/hugeicons";
import { cx } from "@/utils/cx";

const control =
    "absolute bottom-2 flex cursor-pointer items-center justify-center bg-primary text-primary outline-focus-ring focus-visible:outline-2 focus-visible:outline-offset-2";
// Figma's onHover variant; also shown on keyboard focus and on touch screens, which cannot hover.
const hoverAction = cx(
    control,
    "size-6 rounded-[7px] p-1 opacity-0 transition-opacity duration-100 ease-linear group-focus-within:opacity-100 group-hover:opacity-100 pointer-coarse:opacity-100",
);

export interface ResultTileProps {
    src: string;
    alt: string;
    isFavorite?: boolean;
    onFavoriteChange?: (isFavorite: boolean) => void;
    /** Shows the expand button (opens the lightbox). */
    onOpen?: () => void;
    /** Shows the download button. */
    onDownload?: () => void;
    favoriteLabel?: string;
    openLabel?: string;
    downloadLabel?: string;
    className?: string;
}

/** One generated headshot with its glow, favourite toggle and hover actions. */
export const ResultTile = ({
    src,
    alt,
    isFavorite = false,
    onFavoriteChange,
    onOpen,
    onDownload,
    favoriteLabel = "Favourite",
    openLabel = "Open",
    downloadLabel = "Download",
    className,
}: ResultTileProps) => (
    <div className={cx("group relative h-[261px] w-[233px] shrink-0 rounded-[13px] bg-secondary", className)}>
        <img src={src} alt="" aria-hidden="true" className="absolute top-20 left-[63px] h-[146px] w-[108px] rounded-[5px] object-cover opacity-50 blur-lg" />
        <img src={src} alt={alt} className="absolute top-[33px] left-[47px] h-[185px] w-[140px] rounded-[9px] object-cover" />

        <AriaToggleButton aria-label={favoriteLabel} isSelected={isFavorite} onChange={onFavoriteChange} className={cx(control, "left-2 size-7 rounded-full")}>
            <FavouriteIcon aria-hidden="true" className={cx("size-4", isFavorite && "text-[#FA1D37] [&_path]:fill-current")} />
        </AriaToggleButton>
        {onOpen && (
            <AriaButton aria-label={openLabel} onPress={onOpen} className={cx(hoverAction, "left-1/2 -translate-x-1/2")}>
                <SquareArrowExpand01SharpIcon aria-hidden="true" className="size-4" />
            </AriaButton>
        )}
        {onDownload && (
            <AriaButton aria-label={downloadLabel} onPress={onDownload} className={cx(hoverAction, "right-2")}>
                <ImageDownloadIcon aria-hidden="true" className="size-4" />
            </AriaButton>
        )}
    </div>
);
