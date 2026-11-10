"use client";

import type { FC, KeyboardEvent, ReactNode } from "react";
import { useControlledState } from "@react-stately/utils";
import type { ButtonProps as AriaButtonProps, ModalOverlayProps as AriaModalOverlayProps } from "react-aria-components";
import { Button as AriaButton, Dialog as AriaDialog, Modal as AriaModal } from "react-aria-components";
import { ModalOverlay } from "@/components/application/modals/modal";
import { Button } from "@/components/base/buttons/button";
import { ArrowRight01SharpIcon, RemoveCircleIcon } from "@/components/foundations/hugeicons";
import { cx } from "@/utils/cx";

export interface LightboxImage {
    src: string;
    alt: string;
}

interface LightboxProps extends Omit<AriaModalOverlayProps, "children"> {
    images: LightboxImage[];
    /** Index of the image shown (controlled). */
    index?: number;
    /** @default 0 */
    defaultIndex?: number;
    onIndexChange?: (index: number) => void;
    /** Caption above the card (e.g. the result group's header chip). */
    header?: ReactNode | ((index: number) => ReactNode);
    /** Buttons under the photo; use `LightboxAction`. */
    actions?: ReactNode | ((index: number) => ReactNode);
    /** Names the dialog. @default "Image viewer" */
    "aria-label"?: string;
}

const render = (slot: LightboxProps["header"], index: number) => (typeof slot === "function" ? slot(index) : slot);

/**
 * Full-bleed image viewer over a near-opaque frosted backdrop: the current photo on a glass card with its own
 * colour glow, actions below it, previous/next buttons at the screen edges and a peek of the next photo.
 * Escape closes, Left/Right arrows step through `images`, focus is trapped and returns to the trigger.
 * Open it like a `Modal`: inside a `DialogTrigger`, or with `isOpen`/`onOpenChange`.
 */
export const Lightbox = ({
    images,
    index: indexProp,
    defaultIndex = 0,
    onIndexChange,
    header,
    actions,
    "aria-label": ariaLabel = "Image viewer",
    ...overlayProps
}: LightboxProps) => {
    const [index, setIndex] = useControlledState(indexProp, defaultIndex, onIndexChange);
    const image = images[index];
    const next = images[index + 1];
    const hasPrev = index > 0;
    const hasNext = index < images.length - 1;

    const onKeyDown = (event: KeyboardEvent) => {
        if (event.defaultPrevented) return;
        if (event.key === "ArrowLeft" && hasPrev) setIndex(index - 1);
        else if (event.key === "ArrowRight" && hasNext) setIndex(index + 1);
        else return;
        event.preventDefault();
    };

    const navClassName =
        "size-8 rounded-full p-1.5 outline-white *:data-icon:size-5 *:data-icon:text-[#141B34] sm:fixed sm:top-[calc(50%+36px)] sm:-translate-y-1/2";

    return (
        <ModalOverlay {...overlayProps} backdrop="lightbox" className="items-center p-0 sm:p-0">
            <AriaModal className="size-full outline-hidden">
                {/* Key events from the dialog and anything focused inside it bubble here. */}
                <div className="size-full" onKeyDown={onKeyDown}>
                    <AriaDialog
                        aria-label={ariaLabel}
                        className="relative flex size-full flex-col items-center justify-center px-4 pt-24 pb-6 outline-hidden sm:pt-[105px] sm:pb-[33px]"
                    >
                        {header && <div className="absolute top-4 left-4 sm:top-[27px] sm:left-1/2 sm:-translate-x-1/2">{render(header, index)}</div>}

                        <AriaButton
                            slot="close"
                            aria-label="Close"
                            className="absolute top-5 right-4 cursor-pointer rounded-full text-white outline-white transition duration-100 ease-linear hover:text-white/80 focus-visible:outline-2 focus-visible:outline-offset-2 sm:top-[30px] sm:right-[31px]"
                        >
                            <RemoveCircleIcon className="size-8 sm:size-[41px]" />
                        </AriaButton>

                        {/* Announces the position; the photo's alt text says what it is. */}
                        <p className="sr-only" aria-live="polite">{`Image ${index + 1} of ${images.length}`}</p>

                        {image && (
                            <figure className="relative isolate flex max-w-full flex-col items-center gap-[27px] overflow-hidden rounded-[32px] bg-white/10 px-4 pt-6 pb-6 sm:px-[81.5px] sm:pt-[68px] sm:pb-14">
                                {/* Colour glow: the photo itself, heavily blurred, behind the glass. */}
                                <img
                                    src={image.src}
                                    alt=""
                                    aria-hidden="true"
                                    className="absolute inset-0 -z-10 size-full scale-125 object-cover opacity-60 blur-[100px]"
                                />

                                <div className="relative">
                                    <img
                                        src={image.src}
                                        alt=""
                                        aria-hidden="true"
                                        className="absolute inset-x-[6%] top-[25%] -z-10 h-[79%] w-[88%] object-cover opacity-50 blur-xl"
                                    />
                                    <img
                                        src={image.src}
                                        alt={image.alt}
                                        className="aspect-[344/455] h-[min(455px,calc(100dvh-369px))] w-auto max-w-full rounded-[20px] object-cover"
                                    />
                                </div>

                                {actions && <div className="flex items-start justify-center gap-16">{render(actions, index)}</div>}

                                <div className="flex gap-3 sm:contents">
                                    <Button
                                        color="secondary"
                                        aria-label="Previous image"
                                        isDisabled={!hasPrev}
                                        onPress={() => setIndex(index - 1)}
                                        iconLeading={<ArrowRight01SharpIcon data-icon="leading" className="rotate-180" />}
                                        className={cx(navClassName, "sm:left-7")}
                                    />
                                    <Button
                                        color="secondary"
                                        aria-label="Next image"
                                        isDisabled={!hasNext}
                                        onPress={() => setIndex(index + 1)}
                                        iconLeading={ArrowRight01SharpIcon}
                                        className={cx(navClassName, "sm:right-[35px]")}
                                    />
                                </div>
                            </figure>
                        )}

                        {/* Peek of the next photo, right of the card. Decorative: the Next button does the work. */}
                        {next && (
                            <img
                                src={next.src}
                                alt=""
                                aria-hidden="true"
                                className="pointer-events-none absolute top-[calc(50%+36px)] left-[calc(50%+308.5px)] hidden h-[398px] w-[301px] -translate-y-1/2 rounded-[20px] object-cover opacity-50 xl:block"
                            />
                        )}
                    </AriaDialog>
                </div>
            </AriaModal>
        </ModalOverlay>
    );
};

interface LightboxActionProps extends Omit<AriaButtonProps, "children" | "className"> {
    /** Visible label under the icon; also the accessible name. */
    label: string;
    icon: FC<{ className?: string }>;
    /** `circle`: 56px round (favourite). `square`: 55px rounded tile (download). @default "circle" */
    shape?: "circle" | "square";
    /** Toggle state (e.g. favourited): sets `aria-pressed` and fills the icon. */
    isSelected?: boolean;
    className?: string;
}

/** A labelled white icon button for the `Lightbox` `actions` slot ("Add to Favorite", "Download"). */
export const LightboxAction = ({ label, icon: Icon, shape = "circle", isSelected, className, ...props }: LightboxActionProps) => (
    <AriaButton
        {...props}
        aria-pressed={isSelected}
        className={cx(
            "group flex cursor-pointer flex-col items-center gap-1.5 rounded-lg text-sm/[normal] font-medium text-white outline-white focus-visible:outline-2 focus-visible:outline-offset-4",
            className,
        )}
    >
        <span
            className={cx(
                "flex items-center justify-center bg-white text-[#1E212C] transition duration-100 ease-linear group-hover:bg-neutral-100",
                shape === "circle" ? "size-14 rounded-full" : "rounded-2xl p-[9px]",
            )}
        >
            <Icon className={cx(shape === "circle" ? "size-8" : "size-[37.33px]", isSelected && "fill-current text-[#FA1D37]")} />
        </span>
        {label}
    </AriaButton>
);
