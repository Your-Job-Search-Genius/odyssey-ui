"use client";

import type { ComponentProps, FC, KeyboardEvent, ReactNode, Ref } from "react";
import { useState } from "react";
import { useControlledState } from "@react-stately/utils";
import { AnimatePresence, MotionConfig, motion, useMotionValue, useTransform } from "motion/react";
import type { Variants } from "motion/react";
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
    /** Buttons under the photo; use `LightboxAction`. Up to three fit on a phone. */
    actions?: ReactNode | ((index: number) => ReactNode);
    /** Names the dialog. @default "Image viewer" */
    "aria-label"?: string;
    /** @default "Close" */
    closeLabel?: string;
    /** @default "Previous image" */
    previousLabel?: string;
    /** @default "Next image" */
    nextLabel?: string;
    /** Text the live region announces for the current image. @default (position, total) => `Image ${position} of ${total}` */
    positionLabel?: (position: number, total: number) => string;
}

const render = (slot: LightboxProps["header"], index: number) => (typeof slot === "function" ? slot(index) : slot);

const defaultPositionLabel = (position: number, total: number) => `Image ${position} of ${total}`;

// A drag this far (px), or a flick this fast (px/s), turns the page; anything less springs back.
const SWIPE_OFFSET = 80;
const SWIPE_VELOCITY = 500;

// After React Bits' drag carousels: the photo swings in on a 3D turn out of a blur, and leaves the same way.
// `direction` is 1 going forward (in from the right), -1 going back.
const slideVariants: Variants = {
    enter: (direction: number) => ({ x: direction * 220, rotateY: direction * -40, scale: 0.85, opacity: 0, filter: "blur(12px)" }),
    center: {
        x: 0,
        rotateY: 0,
        scale: 1,
        opacity: 1,
        filter: "blur(0px)",
        transition: { type: "spring", stiffness: 260, damping: 28, opacity: { duration: 0.25 }, filter: { duration: 0.3 } },
    },
    exit: (direction: number) => ({
        x: direction * -220,
        rotateY: direction * 40,
        scale: 0.85,
        opacity: 0,
        filter: "blur(12px)",
        transition: { duration: 0.3, ease: [0.32, 0.72, 0, 1] },
    }),
};

interface FadeImageProps extends Omit<ComponentProps<typeof motion.img>, "style" | "initial" | "animate" | "exit"> {
    /** AnimatePresence measures and removes it through this. */
    ref?: Ref<HTMLImageElement>;
    /** Opacity it fades in to. */
    to: number;
}

/** A decorative image that fades in to `to` and back out when it leaves; opacity on the main thread (see Slide). */
const FadeImage = ({ ref, to, ...props }: FadeImageProps) => {
    const opacity = useMotionValue(0);
    return (
        <motion.img
            ref={ref}
            alt=""
            aria-hidden="true"
            draggable={false}
            {...props}
            style={{ opacity }}
            initial={{ opacity: 0 }}
            animate={{ opacity: to }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
        />
    );
};

// The peeks of the neighbouring photos, either side of the card (xl+, where there's room).
const peekClassName = "pointer-events-none absolute top-[calc(50%+36px)] hidden h-[398px] w-[301px] -translate-y-1/2 rounded-[20px] object-cover xl:block";

interface SlideProps {
    /** AnimatePresence's popLayout measures the leaving slide through it. */
    ref?: Ref<HTMLDivElement>;
    /** Which way it moves (see slideVariants). AnimatePresence only passes its `custom` to a leaving slide, so the
        entering one needs it here or its variants compute NaN and the transforms are skipped. */
    direction: number;
    canPrev: boolean;
    canNext: boolean;
    onSwipe: (step: 1 | -1) => void;
    children: ReactNode;
}

/** One photo, draggable sideways: it tilts as it goes, like a card flicked off a table, and carries on out when it turns the page. */
const Slide = ({ ref, direction, canPrev, canNext, onSwipe, children }: SlideProps) => {
    const x = useMotionValue(0);
    const rotate = useTransform(x, [-300, 0, 300], [-8, 0, 8]);
    // Our own motion values animate on the main thread. Left to motion, opacity and blur run as WAAPI animations whose end
    // values aren't written back, so the frame the leaving slide is removed flashed it opaque (and the new one blurred).
    const opacity = useMotionValue(1);
    const filter = useMotionValue("blur(0px)");
    const draggable = canPrev || canNext;
    return (
        <motion.div
            ref={ref}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            style={{ x, rotate, opacity, filter, transformPerspective: 1200 }}
            drag={draggable ? "x" : false}
            dragConstraints={{ left: 0, right: 0 }}
            // Firm at the ends: the first and last photo only give a little.
            dragElastic={{ left: canNext ? 0.8 : 0.1, right: canPrev ? 0.8 : 0.1 }}
            onDragEnd={(_, { offset, velocity }) => {
                if (canNext && (offset.x < -SWIPE_OFFSET || velocity.x < -SWIPE_VELOCITY)) onSwipe(1);
                else if (canPrev && (offset.x > SWIPE_OFFSET || velocity.x > SWIPE_VELOCITY)) onSwipe(-1);
            }}
            // Phones: as wide as the card allows, narrower when the screen is short (251px = the vertical chrome around
            // the photo: 69 top, 46 + 11 + 32 + 14 card, 16 + 52 actions, 11 bottom).
            className={cx(
                "relative w-full max-w-[calc((100dvh-251px)*334/441)] md:w-auto md:max-w-none",
                draggable && "cursor-grab select-none active:cursor-grabbing",
            )}
        >
            {children}
        </motion.div>
    );
};

/**
 * Full-bleed image viewer over a near-opaque frosted backdrop: the current photo on a glass card with its own
 * colour glow, actions below it, previous/next buttons at the screen edges and peeks of the previous and next photo.
 * Changing photo animates (a 3D swing out of a blur) and the photo can be dragged sideways to change it.
 * Below the `md` breakpoint it switches to Figma's phone layout: an edge-to-edge card with the arrows under the
 * photo and small actions below the card.
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
    closeLabel = "Close",
    previousLabel = "Previous image",
    nextLabel = "Next image",
    positionLabel = defaultPositionLabel,
    ...overlayProps
}: LightboxProps) => {
    const [index, setIndex] = useControlledState(indexProp, defaultIndex, onIndexChange);
    // Which way the photos move: forward slides in from the right, back from the left.
    const [direction, setDirection] = useState(1);
    const go = (to: number) => {
        setDirection(to > index ? 1 : -1);
        setIndex(to);
    };
    const image = images[index];
    const prev = images[index - 1];
    const next = images[index + 1];
    const hasPrev = index > 0;
    const hasNext = index < images.length - 1;

    const onKeyDown = (event: KeyboardEvent) => {
        if (event.defaultPrevented) return;
        if (event.key === "ArrowLeft" && hasPrev) go(index - 1);
        else if (event.key === "ArrowRight" && hasNext) go(index + 1);
        else return;
        event.preventDefault();
    };

    // Phones: in a row under the photo. md+: pinned to the screen edges.
    const navClassName =
        "size-8 rounded-full p-1.5 outline-white *:data-icon:size-5 *:data-icon:text-[#141B34] md:fixed md:top-[calc(50%+36px)] md:-translate-y-1/2";

    return (
        <ModalOverlay {...overlayProps} backdrop="lightbox" className="items-center p-0 sm:p-0">
            <AriaModal className="size-full outline-hidden">
                {/* Key events from the dialog and anything focused inside it bubble here. */}
                <div className="size-full" onKeyDown={onKeyDown}>
                    <AriaDialog
                        aria-label={ariaLabel}
                        className="relative flex size-full flex-col items-center justify-start pt-[69px] pb-[11px] outline-hidden md:justify-center md:px-4 md:pt-[105px] md:pb-[33px]"
                    >
                        {header && <div className="absolute top-4 left-4 md:top-[27px] md:left-1/2 md:-translate-x-1/2">{render(header, index)}</div>}

                        <AriaButton
                            slot="close"
                            aria-label={closeLabel}
                            className="absolute top-[25px] right-[19px] cursor-pointer rounded-full text-white outline-white transition duration-100 ease-linear hover:text-white/80 focus-visible:outline-2 focus-visible:outline-offset-2 md:top-[30px] md:right-[31px]"
                        >
                            <RemoveCircleIcon className="size-6 md:size-[41px]" />
                        </AriaButton>

                        {/* Announces the position; the photo's alt text says what it is. */}
                        <p className="sr-only" aria-live="polite">
                            {positionLabel(index + 1, images.length)}
                        </p>

                        {image && (
                            // reducedMotion "user": with prefers-reduced-motion the photos only fade (no slide, turn or scale).
                            <MotionConfig reducedMotion="user">
                                {/* overflow-clip, not hidden: a hidden box can still be scrolled (focus moving to an action, a
                                dialog opening over it), which shifted the photo and kept it shifted for every slide. */}
                                <figure className="relative isolate flex w-full flex-col items-center gap-4 md:w-auto md:max-w-full md:gap-[27px] md:overflow-clip md:rounded-[32px] md:bg-white/10 md:px-[81.5px] md:pt-[68px] md:pb-14">
                                    {/* Phones: the glass card holds the photo and arrows, with the actions below it. md+: it
                                    dissolves (contents) and the figure itself is the card, actions inside. */}
                                    <div className="relative isolate flex w-full flex-col items-center gap-[11px] overflow-clip rounded-[26px] bg-white/10 px-[34px] pt-[46px] pb-3.5 md:contents">
                                        {/* Colour glow: the photo itself, heavily blurred, behind the glass; crossfades with it. */}
                                        <AnimatePresence initial={false}>
                                            <FadeImage
                                                key={index}
                                                to={0.6}
                                                src={image.src}
                                                className="absolute inset-0 -z-10 size-full scale-125 object-cover blur-[100px]"
                                            />
                                        </AnimatePresence>

                                        {/* popLayout: the leaving photo is lifted out of the layout, so the card keeps one photo's size. */}
                                        <AnimatePresence initial={false} custom={direction} mode="popLayout">
                                            <Slide key={index} direction={direction} canPrev={hasPrev} canNext={hasNext} onSwipe={(step) => go(index + step)}>
                                                <img
                                                    src={image.src}
                                                    alt=""
                                                    aria-hidden="true"
                                                    draggable={false}
                                                    className="absolute inset-x-[6%] top-[25%] -z-10 h-[79%] w-[88%] object-cover opacity-50 blur-xl"
                                                />
                                                <img
                                                    src={image.src}
                                                    alt={image.alt}
                                                    draggable={false}
                                                    className="aspect-[334/441] w-full rounded-[21px] object-cover md:aspect-[344/455] md:h-[min(455px,calc(100dvh-369px))] md:w-auto md:max-w-full md:rounded-[20px]"
                                                />
                                            </Slide>
                                        </AnimatePresence>

                                        <div className="flex gap-6 md:contents">
                                            <Button
                                                color="secondary"
                                                aria-label={previousLabel}
                                                isDisabled={!hasPrev}
                                                onPress={() => go(index - 1)}
                                                iconLeading={<ArrowRight01SharpIcon data-icon="leading" className="rotate-180" />}
                                                className={cx(navClassName, "md:left-7")}
                                            />
                                            <Button
                                                color="secondary"
                                                aria-label={nextLabel}
                                                isDisabled={!hasNext}
                                                onPress={() => go(index + 1)}
                                                iconLeading={ArrowRight01SharpIcon}
                                                className={cx(navClassName, "md:right-[35px]")}
                                            />
                                        </div>
                                    </div>

                                    {/* Phones: equal columns across the screen (labels never wrap); md+: a centred row. */}
                                    {actions && (
                                        <div className="grid w-full auto-cols-[1fr] grid-flow-col justify-items-center px-4 md:flex md:w-auto md:items-start md:justify-center md:gap-16 md:px-0">
                                            {render(actions, index)}
                                        </div>
                                    )}
                                </figure>
                            </MotionConfig>
                        )}

                        {/* Peeks of the previous photo (left) and the next one (right), crossfading as the photo changes.
                            Decorative: the Previous/Next buttons do the work. */}
                        <AnimatePresence initial={false}>
                            {prev && <FadeImage key={`prev-${index - 1}`} to={0.5} src={prev.src} className={cx(peekClassName, "right-[calc(50%+308.5px)]")} />}
                            {next && <FadeImage key={`next-${index + 1}`} to={0.5} src={next.src} className={cx(peekClassName, "left-[calc(50%+308.5px)]")} />}
                        </AnimatePresence>
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
    /** `circle`: round (favourite), 56px (24px on phones). `square`: rounded tile (download), 55px (24x28 on phones). @default "circle" */
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
            "group flex cursor-pointer flex-col items-center gap-1.5 rounded-lg text-[13px]/[normal] font-medium whitespace-nowrap text-white outline-white focus-visible:outline-2 focus-visible:outline-offset-4 md:text-sm/[normal]",
            className,
        )}
    >
        <span
            className={cx(
                "flex items-center justify-center bg-white text-[#1E212C] transition duration-100 ease-linear group-hover:bg-neutral-100",
                shape === "circle" ? "size-6 rounded-full md:size-14" : "h-7 w-6 rounded-lg md:size-auto md:rounded-2xl md:p-[9px]",
            )}
        >
            <Icon className={cx(shape === "circle" ? "size-3.5 md:size-8" : "size-4 md:size-[37.33px]", isSelected && "fill-current text-[#FA1D37]")} />
        </span>
        {label}
    </AriaButton>
);
