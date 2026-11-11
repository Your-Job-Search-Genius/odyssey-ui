"use client";

import type { ReactNode } from "react";
import type { RadioGroupProps as AriaRadioGroupProps, RadioProps as AriaRadioProps } from "react-aria-components";
import { Label as AriaLabel, Radio as AriaRadio, RadioGroup as AriaRadioGroup } from "react-aria-components";
import { cx } from "@/utils/cx";

export interface ModelSwitcherProps extends Omit<AriaRadioGroupProps, "className" | "children"> {
    /** Visible label above the strip, e.g. "Who wears the outfits"; it names the radio group. */
    label: ReactNode;
    /** `ModelSwitcherOption`s, usually the mix first. */
    children: ReactNode;
    className?: string;
}

/**
 * One-tap strip choosing who wears the outfit previews: a portrait per person, usually with a "Mix" option first.
 * Scrolls sideways when it runs out of room (phones). Arrow keys move the selection, as in any radio group.
 */
export const ModelSwitcher = ({ label, children, className, ...props }: ModelSwitcherProps) => (
    <AriaRadioGroup orientation="horizontal" {...props} className={cx("flex min-w-0 flex-col gap-2", className)}>
        <AriaLabel className="text-xs font-medium tracking-[0.04em] text-tertiary uppercase">{label}</AriaLabel>
        <div className="flex gap-1.5 overflow-x-auto rounded-2xl bg-tertiary p-1.5">{children}</div>
    </AriaRadioGroup>
);

export interface ModelSwitcherOptionProps extends Omit<AriaRadioProps, "children" | "className"> {
    /** Visible under the portrait and the option's accessible name. */
    name: string;
    /** The person's portrait. */
    src?: string;
    /** The mix: up to three portraits side by side in the circle, in place of `src`. */
    srcs?: string[];
    className?: string;
}

export const ModelSwitcherOption = ({ name, src, srcs, className, ...props }: ModelSwitcherOptionProps) => (
    <AriaRadio
        {...props}
        className={({ isSelected, isFocusVisible, isDisabled }) =>
            cx(
                // relative: keeps React Aria's visually hidden input inside the option, so focusing it never scrolls an
                // outer container (see BackgroundTile).
                "relative flex w-16 shrink-0 cursor-pointer flex-col items-center gap-1 rounded-xl pt-1.5 pb-1 outline-focus-ring transition duration-100 ease-linear",
                isSelected ? "bg-primary shadow-xs" : "hover:bg-primary_hover",
                isFocusVisible && "outline-2 outline-offset-2",
                isDisabled && "cursor-not-allowed opacity-50",
                className,
            )
        }
    >
        {({ isSelected }) => (
            <>
                <span
                    aria-hidden="true"
                    className={cx(
                        "flex size-10 overflow-hidden rounded-full bg-secondary",
                        isSelected && "ring-2 ring-brand ring-offset-2 ring-offset-bg-primary",
                    )}
                >
                    {srcs
                        ? srcs.slice(0, 3).map((s) => <img key={s} src={s} alt="" className="h-full min-w-0 flex-1 object-cover" />)
                        : src && <img src={src} alt="" className="size-full object-cover" />}
                </span>
                <span className={cx("max-w-full truncate px-1 text-xs/[18px]", isSelected ? "font-semibold text-primary" : "text-tertiary")}>{name}</span>
            </>
        )}
    </AriaRadio>
);
