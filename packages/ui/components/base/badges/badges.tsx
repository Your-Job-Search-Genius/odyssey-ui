"use client";

import type { MouseEventHandler, ReactNode } from "react";
import { Dot } from "@/components/foundations/dot-icon";
import { CheckmarkCircle02Icon } from "@/components/foundations/hugeicons";
import { X as CloseX } from "@/components/foundations/icons";
import { cx } from "@/utils/cx";
import type { BadgeColors, BadgeTypeToColorMap, BadgeTypes, FlagTypes, IconComponentType, Sizes } from "./badge-types";
import { badgeTypes } from "./badge-types";

export const filledColors: Record<BadgeColors, { root: string; addon: string; addonButton: string }> = {
    gray: {
        root: "bg-utility-neutral-50 text-utility-neutral-700 ring-utility-neutral-200",
        addon: "text-utility-neutral-500",
        addonButton: "hover:bg-utility-neutral-100 text-utility-neutral-400 hover:text-utility-neutral-500",
    },
    // Figma value tag: flat #ECEAFF / #563BDB, no visible ring.
    brand: {
        root: "bg-utility-brand-50 text-utility-brand-600 ring-transparent",
        addon: "text-utility-brand-500",
        addonButton: "hover:bg-utility-brand-100 text-utility-brand-400 hover:text-utility-brand-500",
    },
    error: {
        root: "bg-utility-red-50 text-utility-red-700 ring-utility-red-200",
        addon: "text-utility-red-500",
        addonButton: "hover:bg-utility-red-100 text-utility-red-400 hover:text-utility-red-500",
    },
    warning: {
        root: "bg-utility-yellow-50 text-utility-yellow-700 ring-utility-yellow-200",
        addon: "text-utility-yellow-500",
        addonButton: "hover:bg-utility-yellow-100 text-utility-yellow-400 hover:text-utility-yellow-500",
    },
    success: {
        root: "bg-utility-green-50 text-utility-green-700 ring-utility-green-200",
        addon: "text-utility-green-500",
        addonButton: "hover:bg-utility-green-100 text-utility-green-400 hover:text-utility-green-500",
    },
    slate: {
        root: "bg-utility-slate-50 text-utility-slate-700 ring-utility-slate-200",
        addon: "text-utility-slate-500",
        addonButton: "hover:bg-utility-slate-100 text-utility-slate-400 hover:text-utility-slate-500",
    },
    sky: {
        root: "bg-utility-sky-50 text-utility-sky-700 ring-utility-sky-200",
        addon: "text-utility-sky-500",
        addonButton: "hover:bg-utility-sky-100 text-utility-sky-400 hover:text-utility-sky-500",
    },
    blue: {
        root: "bg-utility-blue-50 text-utility-blue-700 ring-utility-blue-200",
        addon: "text-utility-blue-500",
        addonButton: "hover:bg-utility-blue-100 text-utility-blue-400 hover:text-utility-blue-500",
    },
    indigo: {
        root: "bg-utility-indigo-50 text-utility-indigo-700 ring-utility-indigo-200",
        addon: "text-utility-indigo-500",
        addonButton: "hover:bg-utility-indigo-100 text-utility-indigo-400 hover:text-utility-indigo-500",
    },
    purple: {
        root: "bg-utility-purple-50 text-utility-purple-700 ring-utility-purple-200",
        addon: "text-utility-purple-500",
        addonButton: "hover:bg-utility-purple-100 text-utility-purple-400 hover:text-utility-purple-500",
    },
    pink: {
        root: "bg-utility-pink-50 text-utility-pink-700 ring-utility-pink-200",
        addon: "text-utility-pink-500",
        addonButton: "hover:bg-utility-pink-100 text-utility-pink-400 hover:text-utility-pink-500",
    },
    orange: {
        root: "bg-utility-orange-50 text-utility-orange-700 ring-utility-orange-200",
        addon: "text-utility-orange-500",
        addonButton: "hover:bg-utility-orange-100 text-utility-orange-400 hover:text-utility-orange-500",
    },
};

const addonOnlyColors = Object.fromEntries(Object.entries(filledColors).map(([key, value]) => [key, { root: "", addon: value.addon }])) as Record<
    BadgeColors,
    { root: string; addon: string }
>;

/**
 * "modern" badges sit on the neutral surface with a subtle shadow; a non-gray color tints the
 * label and addon (dot, icon, close button) only, so every color reads the same in both themes.
 */
const modernColors = Object.fromEntries(
    Object.entries(filledColors).map(([key, value]) => [
        key,
        key === "gray"
            ? {
                  root: "bg-primary text-secondary ring-primary",
                  addon: "text-neutral-500",
                  addonButton: "hover:bg-utility-neutral-100 text-utility-neutral-400 hover:text-utility-neutral-500",
              }
            : {
                  root: cx(
                      "bg-primary ring-primary",
                      value.root.split(" ").find((cls) => cls.startsWith("text-")),
                  ),
                  addon: value.addon,
                  addonButton: value.addonButton,
              },
    ]),
) as Record<BadgeColors, { root: string; addon: string; addonButton: string }>;

const withPillTypes = {
    [badgeTypes.pillColor]: {
        common: "size-max flex items-center whitespace-nowrap rounded-full ring-1 ring-inset",
        styles: filledColors,
    },
    [badgeTypes.badgeColor]: {
        common: "size-max flex items-center whitespace-nowrap rounded-md ring-1 ring-inset",
        styles: filledColors,
    },
    [badgeTypes.badgeModern]: {
        common: "size-max flex items-center whitespace-nowrap rounded-md ring-1 ring-inset shadow-xs",
        styles: modernColors,
    },
};

const withBadgeTypes = {
    [badgeTypes.pillColor]: {
        common: "size-max flex items-center whitespace-nowrap rounded-full ring-1 ring-inset",
        styles: filledColors,
    },
    [badgeTypes.badgeColor]: {
        common: "size-max flex items-center whitespace-nowrap rounded-md ring-1 ring-inset",
        styles: filledColors,
    },
    [badgeTypes.badgeModern]: {
        common: "size-max flex items-center whitespace-nowrap rounded-md ring-1 ring-inset bg-primary text-secondary ring-primary shadow-xs",
        styles: addonOnlyColors,
    },
};

/**
 * BetterShot (Figma) tag recipes for `Badge`. Each is a complete look, so `color` only applies to `generating`.
 * - `shoot`: uppercase shoot tag ("SHOOT FOR GRADUATION").
 * - `option`: chip on an option tile (9px); `size="lg"` is the larger Browse-all chip (16px).
 * - `count`: count chip next to a heading ("Headshots 32").
 * - `generating`: 7px input tags on the generating card; `color` is `gray` | `purple` | `sky`.
 * - `recommended`: gradient tab that sits on a card's top edge (round top corners only).
 */
const recipeTypes = {
    shoot: "rounded-[3px] bg-quaternary px-0.75 py-px text-[13px] leading-[17px] font-medium uppercase text-primary",
    option: "rounded-[3px] bg-[#F0F0F0] px-0.75 py-px text-[9px] leading-[13px] font-semibold text-black",
    count: "min-w-[23px] justify-center rounded-[5px] bg-utility-neutral-300 px-1 text-[13px] leading-[19px] font-semibold text-primary",
    generating: "rounded-[2px] px-0.75 py-px text-[7px] leading-[9px] font-semibold",
    recommended: [
        "rounded-t-[7px] pt-[5px] pr-1.25 pb-[3px] pl-1.5 text-[10px] leading-[13px] font-medium text-white uppercase",
        // Figma's radial gradient, centred below the visible tab (the rest of the shape sits behind the card).
        "bg-[radial-gradient(ellipse_77px_60px_at_41px_31px,#5215FF_0%,#5E2CFF_12.5%,#6B43FF_25%,#8571FF_50%,#9F9FFF_75%,#B9CDFF_100%)]",
    ].join(" "),
};

const generatingColors = {
    gray: "bg-[#EDEDED] text-black",
    purple: "bg-[#DEDBFF] text-[#51008F]",
    // Figma's #00ACCF text is 2.6:1 on #DBFEFF; darkened to pass AA.
    sky: "bg-[#DBFEFF] text-[#007A93]",
};

export type BadgeRecipe = keyof typeof recipeTypes;

export type BadgeColor<T extends BadgeTypes | BadgeRecipe> = T extends BadgeTypes
    ? BadgeTypeToColorMap<typeof withPillTypes>[T]
    : T extends "generating"
      ? keyof typeof generatingColors
      : never;

interface BadgeProps<T extends BadgeTypes | BadgeRecipe> {
    type?: T;
    size?: Sizes;
    color?: BadgeColor<T>;
    children: ReactNode;
    className?: string;
    /** Wrap long text (job titles, names, other free text) onto more lines instead of overflowing the container. */
    wrap?: boolean;
}

export const Badge = <T extends BadgeTypes | BadgeRecipe>(props: BadgeProps<T>) => {
    const { type = "pill-color", size = "md", wrap = false, children } = props;
    const color = (props.color ?? "gray") as string;
    const wrapClass = wrap && "max-w-full wrap-anywhere whitespace-normal";

    if (type in recipeTypes) {
        const recipe = type as BadgeRecipe;
        return (
            <span
                className={cx(
                    "flex size-max items-center whitespace-nowrap",
                    recipeTypes[recipe],
                    recipe === "option" && size === "lg" && "rounded-md px-1.5 py-[3px] text-md leading-[21px]",
                    recipe === "generating" && generatingColors[color as keyof typeof generatingColors],
                    wrapClass,
                    props.className,
                )}
            >
                {children}
            </span>
        );
    }

    const colors = withPillTypes[type as BadgeTypes];

    const pillSizes = {
        sm: "py-0.5 px-2 text-xs font-medium",
        md: "py-0.5 px-2.5 text-sm font-medium",
        lg: "py-1 px-3 text-sm font-medium",
    };
    const badgeSizes = {
        sm: "py-0.5 px-1.5 text-xs font-medium",
        md: "py-0.5 px-2 text-sm font-medium",
        lg: "py-1 px-2.5 text-sm font-medium rounded-lg",
    };

    const sizes = {
        [badgeTypes.pillColor]: pillSizes,
        // `sm` is Figma's value tag geometry ("Blue", "Style 4").
        [badgeTypes.badgeColor]: { ...badgeSizes, sm: "rounded-[3px] py-px px-0.75 text-[13px] leading-[17px] font-medium" },
        [badgeTypes.badgeModern]: badgeSizes,
    };

    return (
        <span className={cx(colors.common, sizes[type as BadgeTypes][size], colors.styles[color as BadgeColors].root, wrapClass, props.className)}>
            {children}
        </span>
    );
};

const statusStyles = {
    done: "gap-0.5 bg-border-secondary pl-1 pr-1.5 text-primary",
    // Figma draws white on #A091FF (2.6:1); the approved fix is #363636 text.
    active: "gap-0.5 bg-brand-300 pl-1.25 pr-1 text-[#363636]",
    pending: "gap-0.5 bg-border-secondary pl-1.5 pr-1 text-tertiary",
};

const statusLabels = { done: "completed", active: "in progress", pending: "not started" };

/** 12px dashed ring (Figma "Small circle"); its 2px stroke overflows the box by 1px like in Figma. */
const DashedRing = ({ className }: { className?: string }) => (
    <svg viewBox="1 1 12 12" fill="none" aria-hidden="true" className={cx("size-3 shrink-0 overflow-visible", className)}>
        <path
            d="M12.9161 5.99447C12.9713 6.32142 13 6.65736 13 7C13 7.34264 12.9713 7.67858 12.9161 8.00553M11.8938 3.52774C11.503 2.97801 11.022 2.49696 10.4723 2.10621M8.00553 1.08389C7.67858 1.02872 7.34264 1 7 1C6.65736 1 6.32142 1.02872 5.99447 1.08389M3.52774 2.10621C2.97801 2.49696 2.49696 2.97801 2.10621 3.52774M1.08389 5.99447C1.02872 6.32142 1 6.65736 1 7C1 7.34264 1.02872 7.67858 1.08389 8.00553M2.10621 10.4723C2.49696 11.022 2.97801 11.503 3.52774 11.8938M5.99447 12.9161C6.32142 12.9713 6.65736 13 7 13C7.34264 13 7.67858 12.9713 8.00553 12.9161M10.4723 11.8938C11.022 11.503 11.503 11.022 11.8938 10.4723"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

interface StatusBadgeProps {
    /** `done` = green check, `active` = violet with a spinning ring (static under reduced motion), `pending` = gray with a dashed ring. */
    status: "done" | "active" | "pending";
    children: ReactNode;
    /** Screen-reader text for the status, appended after the label. Defaults to "completed" / "in progress" / "not started". */
    statusLabel?: string;
    className?: string;
}

/** Progress step chip (Figma "Learning / Shooting / Polish / Ready"). */
export const StatusBadge = ({ status, children, statusLabel, className }: StatusBadgeProps) => (
    <span className={cx("flex size-max items-center rounded-full py-1 text-sm leading-[18px] font-medium whitespace-nowrap", statusStyles[status], className)}>
        {status === "done" ? (
            <CheckmarkCircle02Icon className="size-3.5 shrink-0 text-[#12B76A]" />
        ) : (
            <DashedRing className={status === "active" ? "text-white motion-safe:animate-spin" : "text-primary"} />
        )}
        {children}
        <span className="sr-only">, {statusLabel ?? statusLabels[status]}</span>
    </span>
);

interface BadgeWithDotProps<T extends BadgeTypes> {
    type?: T;
    size?: Sizes;
    color?: BadgeTypeToColorMap<typeof withBadgeTypes>[T];
    className?: string;
    children: ReactNode;
}

export const BadgeWithDot = <T extends BadgeTypes>(props: BadgeWithDotProps<T>) => {
    const { size = "md", color = "gray", type = "pill-color", className, children } = props;

    const colors = withBadgeTypes[type];

    const pillSizes = {
        sm: "gap-1 py-0.5 pl-1.5 pr-2 text-xs font-medium",
        md: "gap-1.5 py-0.5 pl-2 pr-2.5 text-sm font-medium",
        lg: "gap-1.5 py-1 pl-2.5 pr-3 text-sm font-medium",
    };

    const badgeSizes = {
        sm: "gap-1 py-0.5 px-1.5 text-xs font-medium",
        md: "gap-1.5 py-0.5 px-2 text-sm font-medium",
        lg: "gap-1.5 py-1 px-2.5 text-sm font-medium rounded-lg",
    };

    const sizes = {
        [badgeTypes.pillColor]: pillSizes,
        [badgeTypes.badgeColor]: badgeSizes,
        [badgeTypes.badgeModern]: badgeSizes,
    };

    return (
        <span className={cx(colors.common, sizes[type][size], colors.styles[color].root, className)}>
            <Dot className={colors.styles[color].addon} size="sm" />
            {children}
        </span>
    );
};

interface BadgeWithIconProps<T extends BadgeTypes> {
    type?: T;
    size?: Sizes;
    color?: BadgeTypeToColorMap<typeof withBadgeTypes>[T];
    iconLeading?: IconComponentType;
    iconTrailing?: IconComponentType;
    children: ReactNode;
    className?: string;
}

export const BadgeWithIcon = <T extends BadgeTypes>(props: BadgeWithIconProps<T>) => {
    const { size = "md", color = "gray", type = "pill-color", iconLeading: IconLeading, iconTrailing: IconTrailing, children, className } = props;

    const colors = withBadgeTypes[type];

    const icon = IconLeading ? "leading" : "trailing";

    const pillSizes = {
        sm: {
            trailing: "gap-0.5 py-0.5 pl-2 pr-1.5 text-xs font-medium",
            leading: "gap-0.5 py-0.5 pr-2 pl-1.5 text-xs font-medium",
        },
        md: {
            trailing: "gap-1 py-0.5 pl-2.5 pr-2 text-sm font-medium",
            leading: "gap-1 py-0.5 pr-2.5 pl-2 text-sm font-medium",
        },
        lg: {
            trailing: "gap-1 py-1 pl-3 pr-2.5 text-sm font-medium",
            leading: "gap-1 py-1 pr-3 pl-2.5 text-sm font-medium",
        },
    };
    const badgeSizes = {
        sm: {
            trailing: "gap-0.5 py-0.5 pl-2 pr-1.5 text-xs font-medium",
            leading: "gap-0.5 py-0.5 pr-2 pl-1.5 text-xs font-medium",
        },
        md: {
            trailing: "gap-1 py-0.5 pl-2 pr-1.5 text-sm font-medium",
            leading: "gap-1 py-0.5 pr-2 pl-1.5 text-sm font-medium",
        },
        lg: {
            trailing: "gap-1 py-1 pl-2.5 pr-2 text-sm font-medium rounded-lg",
            leading: "gap-1 py-1 pr-2.5 pl-2 text-sm font-medium rounded-lg",
        },
    };

    const sizes = {
        [badgeTypes.pillColor]: pillSizes,
        [badgeTypes.badgeColor]: badgeSizes,
        [badgeTypes.badgeModern]: badgeSizes,
    };

    return (
        <span className={cx(colors.common, sizes[type][size][icon], colors.styles[color].root, className)}>
            {IconLeading && <IconLeading className={cx(colors.styles[color].addon, "size-3 stroke-3")} />}
            {children}
            {IconTrailing && <IconTrailing className={cx(colors.styles[color].addon, "size-3 stroke-3")} />}
        </span>
    );
};

interface BadgeWithFlagProps<T extends BadgeTypes> {
    type?: T;
    size?: Sizes;
    flag?: FlagTypes;
    color?: BadgeTypeToColorMap<typeof withPillTypes>[T];
    children: ReactNode;
}

export const BadgeWithFlag = <T extends BadgeTypes>(props: BadgeWithFlagProps<T>) => {
    const { size = "md", color = "gray", flag = "AU", type = "pill-color", children } = props;

    const colors = withPillTypes[type];

    const pillSizes = {
        sm: "gap-1 py-0.5 pl-0.75 pr-2 text-xs font-medium",
        md: "gap-1.5 py-0.5 pl-1 pr-2.5 text-sm font-medium",
        lg: "gap-1.5 py-1 pl-1.5 pr-3 text-sm font-medium",
    };
    const badgeSizes = {
        sm: "gap-1 py-0.5 pl-1 pr-1.5 text-xs font-medium",
        md: "gap-1.5 py-0.5 pl-1.5 pr-2 text-sm font-medium",
        lg: "gap-1.5 py-1 pl-2 pr-2.5 text-sm font-medium rounded-lg",
    };

    const sizes = {
        [badgeTypes.pillColor]: pillSizes,
        [badgeTypes.badgeColor]: badgeSizes,
        [badgeTypes.badgeModern]: badgeSizes,
    };

    return (
        <span className={cx(colors.common, sizes[type][size], colors.styles[color].root)}>
            <img src={`https://www.untitledui.com/images/flags/${flag}.svg`} className="size-4 max-w-none rounded-full" alt={`${flag} flag`} />
            {children}
        </span>
    );
};

interface BadgeWithImageProps<T extends BadgeTypes> {
    type?: T;
    size?: Sizes;
    imgSrc: string;
    color?: BadgeTypeToColorMap<typeof withPillTypes>[T];
    children: ReactNode;
}

export const BadgeWithImage = <T extends BadgeTypes>(props: BadgeWithImageProps<T>) => {
    const { size = "md", color = "gray", type = "pill-color", imgSrc, children } = props;

    const colors = withPillTypes[type];

    const pillSizes = {
        sm: "gap-1 py-0.5 pl-0.75 pr-2 text-xs font-medium",
        md: "gap-1.5 py-0.5 pl-1 pr-2.5 text-sm font-medium",
        lg: "gap-1.5 py-1 pl-1.5 pr-3 text-sm font-medium",
    };
    const badgeSizes = {
        sm: "gap-1 py-0.5 pl-1 pr-1.5 text-xs font-medium",
        md: "gap-1.5 py-0.5 pl-1.5 pr-2 text-sm font-medium",
        lg: "gap-1.5 py-1 pl-2 pr-2.5 text-sm font-medium rounded-lg",
    };

    const sizes = {
        [badgeTypes.pillColor]: pillSizes,
        [badgeTypes.badgeColor]: badgeSizes,
        [badgeTypes.badgeModern]: badgeSizes,
    };

    return (
        <span className={cx(colors.common, sizes[type][size], colors.styles[color].root)}>
            <img src={imgSrc} className="size-4 max-w-none rounded-full" alt="" />
            {children}
        </span>
    );
};

interface BadgeWithButtonProps<T extends BadgeTypes> {
    type?: T;
    size?: Sizes;
    icon?: IconComponentType;
    color?: BadgeTypeToColorMap<typeof withPillTypes>[T];
    children: ReactNode;
    /**
     * The label for the button.
     */
    buttonLabel?: string;
    /**
     * The click event handler for the button.
     */
    onButtonClick?: MouseEventHandler<HTMLButtonElement>;
}

export const BadgeWithButton = <T extends BadgeTypes>(props: BadgeWithButtonProps<T>) => {
    const { size = "md", color = "gray", type = "pill-color", icon: Icon = CloseX, buttonLabel, children } = props;

    const colors = withPillTypes[type];

    const pillSizes = {
        sm: "gap-0.5 py-0.5 pl-2 pr-0.75 text-xs font-medium",
        md: "gap-0.5 py-0.5 pl-2.5 pr-1 text-sm font-medium",
        lg: "gap-0.5 py-1 pl-3 pr-1.5 text-sm font-medium",
    };
    const badgeSizes = {
        sm: "gap-0.5 py-0.5 pl-1.5 pr-0.75 text-xs font-medium",
        md: "gap-0.5 py-0.5 pl-2 pr-1 text-sm font-medium",
        lg: "gap-0.5 py-1 pl-2.5 pr-1.5 text-sm font-medium rounded-lg",
    };

    const sizes = {
        [badgeTypes.pillColor]: pillSizes,
        [badgeTypes.badgeColor]: badgeSizes,
        [badgeTypes.badgeModern]: badgeSizes,
    };

    return (
        <span className={cx(colors.common, sizes[type][size], colors.styles[color].root)}>
            {children}
            <button
                type="button"
                aria-label={buttonLabel ?? (typeof children === "string" ? `Remove ${children}` : "Remove")}
                onClick={props.onButtonClick}
                className={cx(
                    "flex cursor-pointer items-center justify-center p-0.5 outline-focus-ring transition duration-100 ease-linear focus-visible:outline-2",
                    colors.styles[color].addonButton,
                    type === "pill-color" ? "rounded-full" : "rounded-[3px]",
                )}
            >
                <Icon className="size-3 stroke-[3px] transition-inherit-all" />
            </button>
        </span>
    );
};

interface BadgeIconProps<T extends BadgeTypes> {
    type?: T;
    size?: Sizes;
    icon: IconComponentType;
    color?: BadgeTypeToColorMap<typeof withPillTypes>[T];
    children?: ReactNode;
}

export const BadgeIcon = <T extends BadgeTypes>(props: BadgeIconProps<T>) => {
    const { size = "md", color = "gray", type = "pill-color", icon: Icon, children } = props;

    const colors = withPillTypes[type];

    const pillSizes = {
        sm: "p-1.25",
        md: "p-1.5",
        lg: "p-2",
    };

    const badgeSizes = {
        sm: "p-1.25",
        md: "p-1.5",
        lg: "p-2 rounded-lg",
    };

    const sizes = {
        [badgeTypes.pillColor]: pillSizes,
        [badgeTypes.badgeColor]: badgeSizes,
        [badgeTypes.badgeModern]: badgeSizes,
    };

    return (
        <span className={cx(colors.common, sizes[type][size], colors.styles[color].root)}>
            <Icon className={cx("size-3 stroke-[3px]", colors.styles[color].addon)} />
            {/* The icon is decorative; `children` is its text alternative. */}
            {children && <span className="sr-only">{children}</span>}
        </span>
    );
};
