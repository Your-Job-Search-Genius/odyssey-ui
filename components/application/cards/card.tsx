"use client";

import type { ComponentPropsWithRef, ReactNode } from "react";
import { createContext, useContext, useState } from "react";
import type { ButtonProps as AriaButtonProps, LinkProps as AriaLinkProps } from "react-aria-components";
import { Button as AriaButton, Link as AriaLink } from "react-aria-components";
import { Check, Image01 } from "@/components/foundations/icons";
import { cx, sortCx } from "@/utils/cx";

type CardSize = "sm" | "md" | "lg";

const CardSizeContext = createContext<CardSize>("md");

const paddings = sortCx({
    sm: "gap-3 p-4",
    md: "gap-4 p-5",
    lg: "gap-5 p-6",
});

// The width must include the horizontal padding being bled over — with a plain `w-full`, the
// negative margins only shift the media left and leave a padding-sized gap on the right.
// `max-w-none` beats preflight's `img { max-width: 100% }`, which would cap the calc width.
const mediaBleed = sortCx({
    sm: "-mx-4 -mt-4 w-[calc(100%+2rem)] max-w-none",
    md: "-mx-5 -mt-5 w-[calc(100%+2.5rem)] max-w-none",
    lg: "-mx-6 -mt-6 w-[calc(100%+3rem)] max-w-none",
});

// Same compensation vertically: the top bleed shifts the media up, so filling a sized wrapper
// exactly requires the wrapper's height plus the bled-over top padding.
const mediaFillHeights = sortCx({
    sm: "h-[calc(100%+1rem)]",
    md: "h-[calc(100%+1.25rem)]",
    lg: "h-[calc(100%+1.5rem)]",
});

const footerPadding = sortCx({
    sm: "pt-4",
    md: "pt-5",
    lg: "pt-6",
});

const elevations = sortCx({
    none: "ring-1 ring-secondary ring-inset",
    xs: "shadow-xs ring-1 ring-secondary ring-inset",
    sm: "shadow-sm ring-1 ring-secondary ring-inset",
    md: "shadow-md ring-1 ring-secondary ring-inset",
});

/** Visually hidden skeleton placeholder shown while `isLoading` is true. */
const CardSkeleton = ({ size }: { size: CardSize }) => (
    <div className={cx("flex w-full flex-col", paddings[size])} aria-hidden="true">
        <div className="h-40 w-full animate-pulse rounded-lg bg-secondary" />
        <div className="h-4 w-2/3 animate-pulse rounded bg-secondary" />
        <div className="h-3 w-full animate-pulse rounded bg-secondary" />
        <div className="h-3 w-5/6 animate-pulse rounded bg-secondary" />
    </div>
);

const SelectedIndicator = () => (
    <div className="absolute top-3 right-3 z-10 flex size-5 items-center justify-center rounded-full bg-brand-solid text-fg-white shadow-sm">
        <Check aria-hidden="true" className="size-3 stroke-[3px]" />
    </div>
);

type CardCommonProps = {
    /** Padding + internal gap scale, also used by `Card.Media`/`Card.Footer` to bleed/divide correctly. @default "md" */
    size?: CardSize;
    /** Border + shadow weight. @default "xs" */
    elevation?: keyof typeof elevations;
    /** Disables interaction and shows the `opacity-50` disabled treatment. */
    isDisabled?: boolean;
    /** Shows a checkmark badge and a brand-colored ring to indicate the card is selected. */
    isSelected?: boolean;
    /** Replaces `children` with a skeleton placeholder while content is loading. */
    isLoading?: boolean;
    className?: string;
    children?: ReactNode;
};

interface CardButtonProps extends CardCommonProps, Omit<AriaButtonProps, "children" | "className"> {}

interface CardLinkProps extends CardCommonProps, Omit<AriaLinkProps, "children" | "className"> {
    href: NonNullable<AriaLinkProps["href"]>;
}

interface CardStaticProps extends CardCommonProps, Omit<ComponentPropsWithRef<"div">, "className" | "children"> {}

export type CardProps = CardButtonProps | CardLinkProps | CardStaticProps;

const cardRootClassName = ({
    size = "md",
    elevation = "xs",
    isSelected,
    isDisabled,
    isInteractive,
    isHovered,
    isFocusVisible,
    className,
}: {
    size?: CardSize;
    elevation?: keyof typeof elevations;
    isSelected?: boolean;
    isDisabled?: boolean;
    isInteractive: boolean;
    isHovered?: boolean;
    isFocusVisible?: boolean;
    className?: string;
}) =>
    cx(
        "group relative flex w-full flex-col overflow-hidden rounded-xl bg-primary text-left transition duration-100 ease-linear",
        paddings[size],
        elevations[elevation],
        isSelected && "ring-2 ring-brand ring-inset",
        isInteractive && "cursor-pointer outline-focus-ring",
        isInteractive && isHovered && !isDisabled && "shadow-md ring-primary",
        isInteractive && isFocusVisible && "outline-2 outline-offset-2",
        isDisabled && "cursor-not-allowed opacity-50",
        className,
    );

/**
 * A flexible content container. Compose it with `Card.Media`, `Card.Header`, `Card.Body` and
 * `Card.Footer`. Renders as a plain `<div>` by default; pass `href` to render as a link, or
 * `onPress` to render as a button — exactly one of the two, matching `Button`'s own polymorphic
 * pattern.
 */
const CardRoot = ({ size = "md", elevation = "xs", isDisabled, isSelected, isLoading, className, children, ...props }: CardProps) => {
    const content = isLoading ? <CardSkeleton size={size} /> : children;

    const body = (
        <>
            {content}
            {isSelected && <SelectedIndicator />}
            {isLoading && <span className="sr-only">Loading</span>}
        </>
    );

    if ("href" in props) {
        const { href, ...rest } = props;
        return (
            <CardSizeContext.Provider value={size}>
                <AriaLink
                    {...rest}
                    href={isDisabled ? undefined : href}
                    aria-disabled={isDisabled || undefined}
                    aria-busy={isLoading || undefined}
                    className={({ isHovered, isFocusVisible }) =>
                        cardRootClassName({ size, elevation, isSelected, isDisabled, isInteractive: true, isHovered, isFocusVisible, className })
                    }
                >
                    {body}
                </AriaLink>
            </CardSizeContext.Provider>
        );
    }

    if ("onPress" in props) {
        const { onPress, type, ...rest } = props;
        return (
            <CardSizeContext.Provider value={size}>
                <AriaButton
                    {...rest}
                    type={type || "button"}
                    onPress={onPress}
                    isDisabled={isDisabled}
                    aria-busy={isLoading || undefined}
                    className={({ isHovered, isFocusVisible }) =>
                        cardRootClassName({ size, elevation, isSelected, isDisabled, isInteractive: true, isHovered, isFocusVisible, className })
                    }
                >
                    {body}
                </AriaButton>
            </CardSizeContext.Provider>
        );
    }

    // Neither `href` nor `onPress` matched above, so this is the plain static-div variant.
    const rest = props as CardStaticProps;
    return (
        <CardSizeContext.Provider value={size}>
            <div
                {...rest}
                aria-disabled={isDisabled || undefined}
                aria-busy={isLoading || undefined}
                className={cardRootClassName({ size, elevation, isSelected, isDisabled, isInteractive: false, className })}
            >
                {body}
            </div>
        </CardSizeContext.Provider>
    );
};

export interface CardHeaderProps extends Omit<ComponentPropsWithRef<"div">, "title"> {
    /** Truncates to a single line so a long title never breaks the card's layout. */
    title?: ReactNode;
    /** Clamped to 2 lines so a long description never breaks the card's layout. */
    description?: ReactNode;
    /** Trailing actions slot (e.g. a `Dropdown.DotsButton` overflow menu), aligned to the top-right. */
    actions?: ReactNode;
}

const CardHeader = ({ title, description, actions, children, className, ...props }: CardHeaderProps) => (
    <div {...props} className={cx("flex items-start justify-between gap-4", className)}>
        <div className="flex min-w-0 flex-1 flex-col gap-1">
            {title && <h3 className="truncate text-md font-semibold text-primary">{title}</h3>}
            {description && <p className="line-clamp-2 text-sm text-tertiary">{description}</p>}
            {children}
        </div>
        {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
    </div>
);

const aspectRatios = sortCx({
    square: "aspect-square",
    video: "aspect-video",
    wide: "aspect-21/9",
});

export interface CardMediaProps extends Omit<ComponentPropsWithRef<"img">, "alt"> {
    /**
     * Accessible description of the image. Pass `alt=""` explicitly for purely decorative media —
     * `alt` has no default so this stays an intentional choice rather than an accidental omission.
     */
    alt: string;
    /**
     * Constrains the media to a self-contained ratio (height derived from width). Omit this when
     * you want the image to fill 100% of its parent container's own width *and* height instead —
     * e.g. wrap `Card.Media` in a `div` with an explicit `h-48` and it will fill it completely.
     */
    aspectRatio?: keyof typeof aspectRatios;
}

/**
 * Edge-to-edge media, typically the first child of `Card`. Fills the full width and height of its
 * parent container by default (plus the card padding it bleeds over, with `object-cover`) — give
 * it a sized wrapper, or pass
 * `aspectRatio` for a self-contained ratio instead. Falls back to a placeholder icon when `src` is
 * missing or fails to load, so a broken image never leaves an empty gap in the layout.
 */
const CardMedia = ({ alt, aspectRatio, className, onError, ...props }: CardMediaProps) => {
    const size = useContext(CardSizeContext);
    const [hasError, setHasError] = useState(false);

    const sizeClassName = aspectRatio ? aspectRatios[aspectRatio] : mediaFillHeights[size];

    if (hasError || !props.src) {
        return (
            <div
                role="img"
                aria-label={alt || "Image unavailable"}
                className={cx("flex items-center justify-center bg-secondary text-fg-quaternary", sizeClassName, mediaBleed[size], className)}
            >
                <Image01 aria-hidden="true" className="size-8" />
            </div>
        );
    }

    return (
        <img
            {...props}
            alt={alt}
            onError={(event) => {
                setHasError(true);
                onError?.(event);
            }}
            className={cx("object-cover", sizeClassName, mediaBleed[size], className)}
        />
    );
};

export interface CardBodyProps extends ComponentPropsWithRef<"div"> {}

const CardBody = ({ className, ...props }: CardBodyProps) => <div {...props} className={cx("min-w-0 flex-1 text-sm text-tertiary", className)} />;

export interface CardFooterProps extends ComponentPropsWithRef<"div"> {}

const CardFooter = ({ className, ...props }: CardFooterProps) => {
    const size = useContext(CardSizeContext);
    return <div {...props} className={cx("flex items-center justify-between gap-3 border-t border-secondary", footerPadding[size], className)} />;
};

export const Card = CardRoot as typeof CardRoot & {
    Header: typeof CardHeader;
    Media: typeof CardMedia;
    Body: typeof CardBody;
    Footer: typeof CardFooter;
};
Card.Header = CardHeader;
Card.Media = CardMedia;
Card.Body = CardBody;
Card.Footer = CardFooter;

/** Applies the gap/padding scale to a raw `Card` when composing sections manually. */
export const cardPadding = paddings;
