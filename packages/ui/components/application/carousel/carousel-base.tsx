"use client";

import type { CSSProperties, ComponentPropsWithRef, FocusEvent, HTMLAttributes, KeyboardEvent, ReactNode, Ref } from "react";
import { cloneElement, createContext, isValidElement, useCallback, useContext, useEffect, useRef, useState } from "react";
import useEmblaCarousel, { type UseEmblaCarouselType } from "embla-carousel-react";
import { ArrowRight01SharpIcon } from "@/components/foundations/hugeicons";
import { cx } from "@/utils/cx";

type CarouselApi = UseEmblaCarouselType[1];
type UseCarouselParameters = Parameters<typeof useEmblaCarousel>;
type CarouselOptions = UseCarouselParameters[0];
type CarouselPlugin = UseCarouselParameters[1];

type CarouselProps = {
    /** The options for the Embla carousel. */
    opts?: CarouselOptions;
    /** The plugins for the Embla carousel. */
    plugins?: CarouselPlugin;
    /** The orientation of the carousel. */
    orientation?: "horizontal" | "vertical";
    /** The function to set the API for the carousel. */
    setApi?: (api: CarouselApi) => void;
    /** Accessible name of each slide (1-based). @default (n, total) => `${n} of ${total}` */
    slideLabel?: (n: number, total: number) => string;
    /** Live-region text announced when the slide changes (1-based). @default (n, total) => `Slide ${n} of ${total}` */
    slideAnnouncement?: (n: number, total: number) => string;
};

type CarouselContextProps = CarouselProps & {
    /** The ref of the carousel. */
    carouselRef: ReturnType<typeof useEmblaCarousel>[0];
    /** The API of the carousel. */
    api: ReturnType<typeof useEmblaCarousel>[1];
    /** The function to scroll the carousel to the previous slide. */
    scrollPrev: () => void;
    /** The function to scroll the carousel to the next slide. */
    scrollNext: () => void;
    /** Whether the carousel can scroll to the previous slide. */
    canScrollPrev: boolean;
    /** Whether the carousel can scroll to the next slide. */
    canScrollNext: boolean;
    /** The index of the selected slide. */
    selectedIndex: number;
    /** The scroll snaps of the carousel. */
    scrollSnaps: number[];
};

/** Targets inside these handle arrow keys themselves, so the carousel must not scroll on them. */
const OWNS_ARROW_KEYS =
    '[role=radiogroup],[role=listbox],[role=grid],[role=treegrid],[role=tablist],[role=menu],[role=menubar],[role=slider],input,textarea,select,[contenteditable]:not([contenteditable="false"])';

export const CarouselContext = createContext<CarouselContextProps | null>(null);

export const useCarousel = () => {
    const context = useContext(CarouselContext);

    if (!context) {
        throw new Error("The `useCarousel` hook must be used within a <Carousel />");
    }

    return context;
};

const defaultSlideLabel = (n: number, total: number) => `${n} of ${total}`;
const defaultSlideAnnouncement = (n: number, total: number) => `Slide ${n} of ${total}`;

const CarouselRoot = ({
    orientation = "horizontal",
    opts,
    setApi,
    plugins,
    slideLabel = defaultSlideLabel,
    slideAnnouncement = defaultSlideAnnouncement,
    className,
    children,
    ...props
}: ComponentPropsWithRef<"div"> & CarouselProps) => {
    const [carouselRef, api] = useEmblaCarousel(
        {
            ...opts,
            axis: orientation === "horizontal" ? "x" : "y",
        },
        plugins,
    );
    const [canScrollPrev, setCanScrollPrev] = useState(false);
    const [canScrollNext, setCanScrollNext] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);
    // Read by onInit, which must stay stable (it's registered as an Embla listener), so an inline formatter is fine.
    const slideLabelRef = useRef(slideLabel);
    useEffect(() => {
        slideLabelRef.current = slideLabel;
    }, [slideLabel]);

    const onInit = useCallback((api: CarouselApi) => {
        if (!api) return;

        setScrollSnaps(api.scrollSnapList());

        // Slides can't know their own index, so name them "N of M" here (on init and reInit),
        // leaving any consumer-supplied aria-label alone.
        const slides = api.slideNodes();
        slides.forEach((slide, i) => {
            if (slide.hasAttribute("aria-label") && !slide.hasAttribute("data-auto-label")) return;
            slide.setAttribute("aria-label", slideLabelRef.current(i + 1, slides.length));
            slide.setAttribute("data-auto-label", "");
        });
    }, []);

    const onSelect = useCallback((api: CarouselApi) => {
        if (!api) return;

        setCanScrollPrev(api.canScrollPrev());
        setCanScrollNext(api.canScrollNext());
        setSelectedIndex(api.selectedScrollSnap());
    }, []);

    const scrollPrev = useCallback(() => {
        api?.scrollPrev();
    }, [api]);

    const scrollNext = useCallback(() => {
        api?.scrollNext();
    }, [api]);

    const handleKeyDown = useCallback(
        (event: KeyboardEvent<HTMLDivElement>) => {
            // Leave arrows to widgets that use them (e.g. a radio group of option tiles inside or around the carousel).
            if (event.defaultPrevented || (event.target as Element).closest?.(OWNS_ARROW_KEYS)) return;
            if (event.key === "ArrowLeft") {
                event.preventDefault();
                scrollPrev();
            } else if (event.key === "ArrowRight") {
                event.preventDefault();
                scrollNext();
            }
        },
        [scrollPrev, scrollNext],
    );

    // Focus moved onto a slide that isn't fully visible (e.g. arrowing through tiles in a radio group): undo the
    // browser's native scroll of the overflow-hidden viewport, then bring the slide in with the least movement.
    const handleFocus = useCallback(
        (event: FocusEvent<HTMLDivElement>) => {
            if (!api) return;
            const root = api.rootNode();
            const slides = api.slideNodes();
            const index = slides.findIndex((slide) => slide.contains(event.target));
            if (index < 0) return;
            root.scrollLeft = 0;
            root.scrollTop = 0;

            const [start, end, size] = orientation === "horizontal" ? (["left", "right", "width"] as const) : (["top", "bottom", "height"] as const);
            const view = root.getBoundingClientRect();
            const box = slides[index].getBoundingClientRect();
            if (box[start] >= view[start] - 1 && box[end] <= view[end] + 1) return;

            // Off the start: align it to the start. Off the end: the earliest leading slide that still shows it whole.
            let first = index;
            if (box[end] > view[end]) {
                while (first > 0 && box[end] - slides[first - 1].getBoundingClientRect()[start] <= view[size] + 1) first--;
            }
            const snap = api.internalEngine().slideRegistry.findIndex((group) => group.includes(first));
            if (snap >= 0) api.scrollTo(snap, window.matchMedia("(prefers-reduced-motion: reduce)").matches);
        },
        [api, orientation],
    );

    useEffect(() => {
        if (!api || !setApi) return;

        setApi(api);
    }, [api, setApi]);

    useEffect(() => {
        if (!api) return;

        onInit(api);
        onSelect(api);

        api.on("reInit", onInit);
        api.on("reInit", onSelect);
        api.on("select", onSelect);

        return () => {
            api?.off("select", onSelect);
        };
    }, [api, onInit, onSelect]);

    return (
        <CarouselContext.Provider
            value={{
                carouselRef,
                api: api,
                opts,
                orientation: orientation || (opts?.axis === "y" ? "vertical" : "horizontal"),
                scrollPrev,
                scrollNext,
                canScrollPrev,
                canScrollNext,
                selectedIndex,
                scrollSnaps,
            }}
        >
            <div
                onKeyDownCapture={handleKeyDown}
                onFocus={handleFocus}
                className={cx("relative", className)}
                role="region"
                aria-roledescription="carousel"
                aria-label="Carousel"
                {...props}
            >
                {children}
                {/* Announces slide changes; silenced while an autoplay plugin is running so it doesn't chatter. */}
                <div aria-live={plugins?.some((plugin) => plugin.name === "autoplay") ? "off" : "polite"} aria-atomic="true" className="sr-only">
                    {scrollSnaps.length > 0 && slideAnnouncement(selectedIndex + 1, scrollSnaps.length)}
                </div>
            </div>
        </CarouselContext.Provider>
    );
};

interface CarouselContentProps extends ComponentPropsWithRef<"div"> {
    /** The class name of the content. */
    className?: string;
    /** Whether to hide the overflow. */
    overflowHidden?: boolean;
}

const CarouselContent = ({ className, overflowHidden = true, ...props }: CarouselContentProps) => {
    const { carouselRef, orientation } = useCarousel();

    return (
        <div ref={carouselRef} className={cx("h-full w-full", overflowHidden && "overflow-hidden")}>
            <div className={cx("flex max-h-full", orientation === "horizontal" ? "" : "flex-col", className)} {...props} />
        </div>
    );
};

const CarouselItem = ({ className, ...props }: ComponentPropsWithRef<"div">) => {
    return <div role="group" aria-roledescription="slide" className={cx("min-w-0 shrink-0 grow-0 basis-full", className)} {...props} />;
};

interface TriggerRenderProps {
    isDisabled: boolean;
    onClick: () => void;
}

interface TriggerProps {
    /** Accessible name. @default "Previous slide" / "Next slide" */
    "aria-label"?: string;
    /** The ref of the trigger. */
    ref?: Ref<HTMLButtonElement>;
    /** If true, the child element will be cloned and passed down the prop of the trigger. */
    asChild?: boolean;
    /** The direction of the trigger. */
    direction: "prev" | "next";
    /** The children of the trigger. Can be a render prop or a valid element. */
    children: ReactNode | ((props: TriggerRenderProps) => ReactNode);
    /** The style of the trigger. */
    style?: CSSProperties;
    /** The class name of the trigger. */
    className?: string | ((args: { isDisabled: boolean }) => string);
}

const Trigger = ({ className, children, asChild, direction, style, "aria-label": ariaLabel, ...props }: TriggerProps) => {
    const { scrollPrev, canScrollNext, scrollNext, canScrollPrev } = useCarousel();

    const isDisabled = direction === "prev" ? !canScrollPrev : !canScrollNext;

    const handleClick = () => {
        if (isDisabled) return;

        direction === "prev" ? scrollPrev() : scrollNext();
    };

    const computedClassName = typeof className === "function" ? className({ isDisabled }) : className;

    const defaultAriaLabel = ariaLabel ?? (direction === "prev" ? "Previous slide" : "Next slide");

    // If the children is a render prop, we need to pass the necessary props to the render prop.
    if (typeof children === "function") {
        return <>{children({ isDisabled, onClick: handleClick })}</>;
    }

    // If the children is a valid element, we need to clone it and pass the necessary props to the cloned element.
    if (asChild && isValidElement(children)) {
        return cloneElement(children, {
            onClick: handleClick,
            disabled: isDisabled,
            "aria-label": defaultAriaLabel,
            style: { ...(children.props as HTMLAttributes<HTMLElement>).style, ...style },
            className: [computedClassName, (children.props as HTMLAttributes<HTMLElement>).className].filter(Boolean).join(" ") || undefined,
        } as HTMLAttributes<HTMLElement>);
    }

    return (
        <button aria-label={defaultAriaLabel} disabled={isDisabled} className={computedClassName} onClick={handleClick} {...props}>
            {children}
        </button>
    );
};

const CarouselPrevTrigger = (props: Omit<TriggerProps, "direction">) => <Trigger {...props} direction="prev" />;

const CarouselNextTrigger = (props: Omit<TriggerProps, "direction">) => <Trigger {...props} direction="next" />;

const arrowStyles =
    "flex cursor-pointer items-center justify-center rounded text-fg-primary outline-focus-ring transition duration-100 ease-linear focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-default disabled:opacity-50";

// Chevron (and button) size: 20px, Figma's phone 17px, or 17px below `md`.
const arrowSizes = { md: "size-5", sm: "size-[17px]", responsive: "size-[17px] md:size-5" };

interface CarouselArrowsProps {
    /** `sm` = Figma's phone 17px chevrons; `responsive` = `sm` below `md`, `md` from `md` up. @default "md" */
    size?: "md" | "sm" | "responsive";
    /** @default "Previous slide" */
    prevLabel?: string;
    /** @default "Next slide" */
    nextLabel?: string;
    className?: string;
}

/** A ready-styled prev/next pair for a carousel's header row: 20px chevrons, each dimmed to 50% at the end it can't scroll past. */
const CarouselArrows = ({ size = "md", prevLabel, nextLabel, className }: CarouselArrowsProps) => (
    <div className={cx("flex items-center", className)}>
        <Trigger direction="prev" aria-label={prevLabel} className={cx(arrowStyles, arrowSizes[size])}>
            <ArrowRight01SharpIcon aria-hidden="true" className={cx("rotate-180", arrowSizes[size])} />
        </Trigger>
        <Trigger direction="next" aria-label={nextLabel} className={cx(arrowStyles, arrowSizes[size])}>
            <ArrowRight01SharpIcon aria-hidden="true" className={arrowSizes[size]} />
        </Trigger>
    </div>
);

interface CarouselIndicatorRenderProps {
    isSelected: boolean;
    onClick: () => void;
}

interface CarouselIndicatorProps {
    /** The index of the indicator. */
    index: number;
    /** If true, the child element will be cloned and passed down the prop of the indicator. */
    asChild?: boolean;
    /** If true, the indicator will be selected. */
    isSelected?: boolean;
    /** The children of the indicator. Can be a render prop or a valid element. */
    children?: ReactNode | ((props: CarouselIndicatorRenderProps) => ReactNode);
    /** The style of the indicator. */
    style?: CSSProperties;
    /** The class name of the indicator. */
    className?: string | ((args: { isSelected: boolean }) => string);
    /** Accessible name. @default `Go to slide ${index + 1}` */
    "aria-label"?: string;
}

const CarouselIndicator = ({ index, isSelected = false, children, asChild, className, style, "aria-label": ariaLabel }: CarouselIndicatorProps) => {
    const { api, selectedIndex } = useCarousel();

    isSelected = isSelected || selectedIndex === index;

    const handleClick = () => {
        api?.scrollTo(index);
    };
    const computedClassName = typeof className === "function" ? className({ isSelected }) : className;

    const defaultAriaLabel = ariaLabel ?? `Go to slide ${index + 1}`;

    // If the children is a render prop, we need to pass the necessary props to the render prop.
    if (typeof children === "function") {
        return <>{children({ isSelected, onClick: handleClick })}</>;
    }

    // If the children is a valid element, we need to clone it and pass the necessary props to the cloned element.
    if (asChild && isValidElement(children)) {
        return cloneElement(children, {
            onClick: handleClick,
            "aria-label": defaultAriaLabel,
            "aria-current": isSelected ? "true" : undefined,
            style: { ...(children.props as HTMLAttributes<HTMLElement>).style, ...style },
            className: [computedClassName, (children.props as HTMLAttributes<HTMLElement>).className].filter(Boolean).join(" ") || undefined,
        } as HTMLAttributes<HTMLElement>);
    }

    return (
        <button aria-label={defaultAriaLabel} aria-current={isSelected ? "true" : undefined} className={computedClassName} onClick={handleClick}>
            {children}
        </button>
    );
};

interface CarouselIndicatorGroupProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
    children: ReactNode | ((props: { index: number }) => ReactNode);
    className?: string;
}

const CarouselIndicatorGroup = ({ children, ...props }: CarouselIndicatorGroupProps) => {
    const { scrollSnaps } = useCarousel();

    // If the children is a render prop, we need to pass the index to the render prop.
    if (typeof children === "function") {
        return (
            <div role="group" aria-label="Slides" {...props}>
                {scrollSnaps.map((index) => children({ index }))}
            </div>
        );
    }

    return (
        <div role="group" aria-label="Slides" {...props}>
            {children}
        </div>
    );
};

export const Carousel = {
    Root: CarouselRoot,
    Content: CarouselContent,
    Item: CarouselItem,
    PrevTrigger: CarouselPrevTrigger,
    NextTrigger: CarouselNextTrigger,
    Arrows: CarouselArrows,
    IndicatorGroup: CarouselIndicatorGroup,
    Indicator: CarouselIndicator,
};
