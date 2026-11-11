"use client";

import type { ComponentProps, ReactNode } from "react";
import { Children } from "react";
import { Carousel, useCarousel } from "@/components/application/carousel/carousel-base";
import { Badge } from "@/components/base/badges/badges";
import { ArrowRight01SharpIcon, CheckmarkCircle02Icon } from "@/components/foundations/hugeicons";
import { cx } from "@/utils/cx";

export interface ReviewCardAttribute {
    label: ReactNode;
    value: ReactNode;
}

export interface ReviewCardProps {
    /** Persona name. */
    name: ReactNode;
    /** Shown after the name, e.g. "Woman". */
    subtitle?: ReactNode;
    /** Persona details, each a label + value tag, separated by dots. */
    attributes?: ReviewCardAttribute[];
    /** Header action, e.g. a small secondary "Edit Details" `Button`. Top right from `md`; on phones it follows the subtitle inline. */
    action?: ReactNode;
    /** Heading level of the name. Sections default to one level below 3; set theirs with `ReviewCard.Section` `headingLevel`. @default 3 */
    headingLevel?: HeadingLevel;
    /** `ReviewCard.Section`s. */
    children?: ReactNode;
    className?: string;
}

type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

/** Review step summary: persona header, then white sections (selfies, looks). */
const ReviewCardRoot = ({ name, subtitle, attributes, action, headingLevel = 3, children, className }: ReviewCardProps) => {
    const Heading = `h${headingLevel}` as const;
    const hasAttributes = !!attributes && attributes.length > 0;
    return (
        <section className={cx("flex flex-col gap-4 overflow-hidden rounded-2xl border border-secondary bg-secondary pt-3", className)}>
            {/* Phones: name, subtitle, action on one line, details 12px below. From md: action top right, details 6px below. */}
            <div className="grid grid-cols-[auto_1fr] items-start gap-y-3 px-[13px] md:grid-cols-[minmax(0,1fr)_auto] md:gap-x-4 md:gap-y-1.5">
                <div className="flex min-w-0 flex-wrap items-center gap-x-[5px]">
                    <Heading className="text-lg/[26px] font-semibold text-primary">{name}</Heading>
                    {subtitle && <span className="text-sm font-medium text-tertiary">{subtitle}</span>}
                </div>
                {action && <div className={cx("shrink-0 md:col-start-2 md:row-start-1", hasAttributes && "md:row-span-2")}>{action}</div>}
                {hasAttributes && (
                    <dl className="col-span-2 flex flex-wrap items-center gap-1.5 md:col-span-1">
                        {attributes.map((attribute, index) => (
                            // The dot trails each item, so a wrapped line ends with it rather than starting with it.
                            <div
                                key={index}
                                className="flex items-center gap-1 not-last:after:ml-0.5 not-last:after:size-1 not-last:after:rounded-full not-last:after:bg-fg-quaternary"
                            >
                                <dt className="text-sm font-medium text-tertiary">{attribute.label}</dt>
                                <dd>
                                    <Badge type="color" color="brand" size="sm">
                                        {attribute.value}
                                    </Badge>
                                </dd>
                            </div>
                        ))}
                    </dl>
                )}
            </div>
            <div className="flex flex-col gap-[3px]">{children}</div>
        </section>
    );
};

export interface ReviewCardSectionProps {
    title: ReactNode;
    /** Shown in a count chip after the title. */
    count?: ReactNode;
    /** Trailing action, e.g. "Edit Photos". */
    action?: ReactNode;
    /** Heading level of the title. @default 4 */
    headingLevel?: HeadingLevel;
    children?: ReactNode;
    className?: string;
}

const ReviewCardSection = ({ title, count, action, headingLevel = 4, children, className }: ReviewCardSectionProps) => {
    const Heading = `h${headingLevel}` as const;
    return (
        <section className={cx("flex min-w-0 flex-col gap-3.5 rounded-[14px] bg-primary p-3.5", className)}>
            <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-1">
                    <Heading className="text-sm/[normal] font-semibold text-primary">{title}</Heading>
                    {count !== undefined && (
                        // Figma's review count chip is the lighter, 14px Medium variant of the count tag.
                        <Badge type="count" className="min-w-[21px] justify-center bg-(--color-border-secondary) text-sm font-medium">
                            {count}
                        </Badge>
                    )}
                </div>
                {action}
            </div>
            {children}
        </section>
    );
};

export interface ReviewCardPhotoProps {
    src: string;
    alt: string;
    /** Marks a look: shows this label (e.g. "Bgd.") with `backgroundSrc` and a check over a bottom fade. */
    backgroundLabel?: ReactNode;
    backgroundSrc?: string;
    /** Size it here. @default "h-[178px] w-[135px]" (selfie); looks are `h-[168px] w-[134px]`. */
    className?: string;
}

const ReviewCardPhoto = ({ src, alt, backgroundLabel, backgroundSrc, className }: ReviewCardPhotoProps) => (
    <div className={cx("relative h-[178px] w-[135px] shrink-0 overflow-hidden rounded-[14px]", className)}>
        <img src={src} alt={alt} className="size-full object-cover" />
        {backgroundLabel !== undefined && (
            <>
                <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-10 bg-linear-to-t from-black/50 to-black/0 to-77%" />
                <span className="absolute right-[7px] bottom-1.5 left-2 flex h-3.5 items-center justify-between">
                    <span className="flex items-center gap-1 text-[8px]/[11px] font-medium text-white">
                        {backgroundLabel}
                        {backgroundSrc && <img src={backgroundSrc} alt="" className="h-3.5 w-2.5 rounded-[2px] object-cover" />}
                    </span>
                    <CheckmarkCircle02Icon aria-hidden="true" className="size-[9px] text-white" />
                </span>
            </>
        )}
    </div>
);

const arrowClassName =
    "absolute top-1/2 z-10 flex size-8 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-secondary bg-primary text-fg-primary outline-focus-ring transition duration-100 ease-linear focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-default disabled:opacity-20";

/** Right-edge fade, shown while more slides are hidden on the right (from `md`; phones show the cut-off slide plainly). */
const CarouselFade = () => {
    const { canScrollNext } = useCarousel();
    return canScrollNext ? (
        <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 right-0 w-[132px] bg-linear-to-r from-transparent to-(--color-bg-primary) max-md:hidden"
        />
    ) : null;
};

export interface ReviewCardCarouselProps extends Pick<ComponentProps<typeof Carousel.Root>, "slideLabel" | "slideAnnouncement"> {
    /** `ReviewCard.Photo`s. */
    children: ReactNode;
    /** Names the carousel region. */
    "aria-label": string;
    /** @default "Previous slide" */
    prevLabel?: string;
    /** @default "Next slide" */
    nextLabel?: string;
    className?: string;
}

/**
 * A row of photos that scrolls horizontally, with overlaid prev/next arrows and a right-edge fade. It runs through the
 * section's right padding to its edge, so the next photo peeks. Phones drop the next arrow and the fade (swipe instead).
 */
const ReviewCardCarousel = ({ children, prevLabel, nextLabel, className, ...props }: ReviewCardCarouselProps) => (
    <Carousel.Root opts={{ align: "start" }} className={cx("-mr-3.5", className)} {...props}>
        <Carousel.Content className="gap-2">
            {Children.map(children, (child) => (
                <Carousel.Item className="basis-auto">{child}</Carousel.Item>
            ))}
        </Carousel.Content>
        <CarouselFade />
        <Carousel.PrevTrigger aria-label={prevLabel} className={cx(arrowClassName, "-left-2.5")}>
            <ArrowRight01SharpIcon aria-hidden="true" className="size-5 rotate-180" />
        </Carousel.PrevTrigger>
        <Carousel.NextTrigger aria-label={nextLabel} className={cx(arrowClassName, "right-[3px] max-md:hidden")}>
            <ArrowRight01SharpIcon aria-hidden="true" className="size-5" />
        </Carousel.NextTrigger>
    </Carousel.Root>
);

export const ReviewCard = ReviewCardRoot as typeof ReviewCardRoot & {
    Section: typeof ReviewCardSection;
    Photo: typeof ReviewCardPhoto;
    Carousel: typeof ReviewCardCarousel;
};
ReviewCard.Section = ReviewCardSection;
ReviewCard.Photo = ReviewCardPhoto;
ReviewCard.Carousel = ReviewCardCarousel;
