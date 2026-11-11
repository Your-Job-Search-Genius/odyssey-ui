import type { FC } from "react";
import { Lightbox, LightboxAction } from "@/components/application/lightbox/lightbox";
import * as LightboxDemos from "@/components/application/lightbox/lightbox.demo";
import { Badge } from "@/components/base/badges/badges";
import { FavouriteIcon, ImageDownloadIcon, UserCircleIcon } from "@/components/foundations/hugeicons";

const face = new URL("../headshot/story-assets/face.jpg", import.meta.url).href;
const portrait = new URL("../headshot/story-assets/portrait.jpg", import.meta.url).href;
const images = [
    { src: face, alt: "Headshot 1" },
    { src: portrait, alt: "Headshot 2" },
];

export default {
    title: "Application/Lightbox",
    decorators: [
        (Story: FC) => (
            <div className="flex min-h-screen w-full items-center justify-center bg-secondary p-4">
                <Story />
            </div>
        ),
    ],
};

export const Default = () => <LightboxDemos.LightboxDemo />;

/** Open, for comparison with Figma at 1440x824. Screenshot `[role=dialog]`. */
export const Figma = () => <LightboxDemos.LightboxDemo defaultOpen />;

/** The P33 group header the results screen passes as `header`. */
const Header = () => (
    <div className="flex items-center gap-2.5 rounded-[10px] bg-white py-1 pr-5 pl-1">
        <img src={face} alt="" className="h-10 w-[41px] shrink-0 rounded-lg object-cover" />
        <div className="flex flex-col gap-1">
            <p className="flex items-center gap-1 text-sm/[normal] font-medium text-secondary">
                OUTFIT 1
                <span aria-hidden="true" className="size-1 rounded-full bg-[#A4A7AE]" />
                <Badge type="count" className="bg-[#E9EAEB] font-medium">
                    2
                </Badge>
                <span className="text-[13px]/[normal]">Photos</span>
            </p>
            <p className="text-sm/[normal] font-semibold text-primary">White T-Shirt and Leather Jacket</p>
        </div>
    </div>
);

/** Phone layout (Figma 14866:305414). Shoot `[role=dialog]` at 402x692 (the frame between Safari's bars). */
export const FigmaPhone = () => (
    <Lightbox
        isOpen
        images={images}
        header={<Header />}
        actions={
            <>
                <LightboxAction label="Add to Favorite" icon={FavouriteIcon} />
                <LightboxAction label="Download" icon={ImageDownloadIcon} shape="square" />
            </>
        }
    />
);

/** Phone, favourited (Figma 14866:304905). */
export const FigmaPhoneFavorite = () => (
    <Lightbox
        isOpen
        images={images}
        header={<Header />}
        actions={
            <>
                <LightboxAction label="Favorite" icon={FavouriteIcon} isSelected />
                <LightboxAction label="Download" icon={ImageDownloadIcon} shape="square" />
            </>
        }
    />
);

/** Three actions on a phone: equal columns, labels on one line. */
export const PhoneThreeActions = () => (
    <Lightbox
        isOpen
        images={images}
        header={<Header />}
        actions={
            <>
                <LightboxAction label="Add to Favorite" icon={FavouriteIcon} />
                <LightboxAction label="Download" icon={ImageDownloadIcon} shape="square" />
                <LightboxAction label="Set as Profile Picture" icon={UserCircleIcon} />
            </>
        }
    />
);
