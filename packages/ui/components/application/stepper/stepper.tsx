"use client";

import type { ComponentPropsWithRef } from "react";
import { Button as AriaButton } from "react-aria-components";
import { ArrowDown01SharpIcon } from "@/components/foundations/hugeicons";
import { cx } from "@/utils/cx";

export interface StepperStep {
    /** Unique key for the step. */
    id: string;
    /** Visible label, e.g. "Take Photo". */
    label: string;
}

export interface StepperProps extends Omit<ComponentPropsWithRef<"nav">, "children"> {
    /** The steps, in order. */
    steps: StepperStep[];
    /** Index of the current step. Steps before it are completed, steps after it are upcoming. */
    currentStep: number;
    /** Makes completed steps buttons that go back to that step. Without it every step is plain text. */
    onStepPress?: (index: number) => void;
    /** Shows a back button before the stepper below `md` (the mobile layout). */
    onBack?: () => void;
    /** Accessible name of the back button. @default "Back" */
    backLabel?: string;
    /** Screen-reader suffix for completed steps (they look like upcoming steps). @default "completed" */
    completedLabel?: string;
}

/** The waisted bridge between two segments, in the segment pair's own coordinates (it depends only on the 39px height and 8px gap). */
const Connector = () => (
    <svg
        aria-hidden="true"
        viewBox="108 0 18 39"
        className="absolute top-0 -left-[13px] -z-10 h-[39px] w-[18px] overflow-visible fill-bg-tertiary stroke-bg-tertiary"
    >
        <path
            strokeWidth={2}
            strokeLinejoin="round"
            d="M108.938 9.305C110.318 11.391 112.48 13 114.981 13H119.019C121.52 13 123.682 11.391 125.062 9.305V29.695C123.682 27.609 121.52 26 119.019 26H114.981C112.48 26 110.318 27.609 108.938 29.695Z"
        />
    </svg>
);

/** 12px in-progress ring shown after the current step's label. */
const ProgressRing = () => (
    <svg aria-hidden="true" viewBox="0 0 12 12" fill="none" className="size-3 shrink-0" strokeWidth={2}>
        <circle cx="6" cy="6" r="5" className="stroke-[#CFD3FC] dark:stroke-brand-900" />
        <path
            d="M6 1A5 5 0 1 1 1.285 7.664"
            strokeLinecap="round"
            // Figma's arc runs from 12 o'clock clockwise to about 8 o'clock.
            className="stroke-current"
        />
    </svg>
);

/**
 * A compact segmented progress indicator for short linear flows (2-4 steps): gray segments joined by
 * "gooey" bridges, with the current step lifted onto a white pill. Rendered as an ordered list inside a
 * `nav`; the current step has `aria-current="step"`. Completed and upcoming steps look alike (as drawn),
 * so completed ones carry a screen-reader suffix, and become buttons when `onStepPress` is set.
 */
export const Stepper = ({ steps, currentStep, onStepPress, onBack, backLabel = "Back", completedLabel = "completed", className, ...props }: StepperProps) => (
    <nav aria-label="Progress" {...props} className={cx("flex items-center gap-3", className)}>
        {onBack && (
            <AriaButton
                aria-label={backLabel}
                onPress={onBack}
                className="flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-lg text-fg-secondary outline-focus-ring transition duration-100 ease-linear hover:bg-primary_hover focus-visible:outline-2 focus-visible:outline-offset-2 md:hidden"
            >
                <ArrowDown01SharpIcon aria-hidden="true" className="size-5 rotate-90" />
            </AriaButton>
        )}

        <ol className="isolate flex items-center gap-2">
            {steps.map((step, index) => {
                const isCurrent = index === currentStep;
                const isCompleted = index < currentStep;
                const pill = cx(
                    // pt-0.5 sits the label 1px low, where Figma draws it.
                    "flex h-[33px] items-center gap-1 rounded-[19px] px-[9px] pt-0.5 text-sm font-medium whitespace-nowrap",
                    isCurrent ? "bg-primary text-brand-tertiary" : "text-subtle",
                );
                const content = (
                    <>
                        {step.label}
                        {isCurrent && <ProgressRing />}
                        {isCompleted && <span className="sr-only">({completedLabel})</span>}
                    </>
                );

                return (
                    <li
                        key={step.id}
                        aria-current={isCurrent ? "step" : undefined}
                        className="relative flex h-[39px] items-center rounded-full bg-tertiary p-[3px] shadow-[inset_0_2px_3px_var(--color-bg-primary)]"
                    >
                        {index > 0 && <Connector />}
                        {isCompleted && onStepPress ? (
                            <AriaButton
                                onPress={() => onStepPress(index)}
                                className={cx(
                                    pill,
                                    "cursor-pointer outline-focus-ring transition duration-100 ease-linear hover:bg-primary_hover hover:text-tertiary focus-visible:outline-2 focus-visible:outline-offset-2",
                                )}
                            >
                                {content}
                            </AriaButton>
                        ) : (
                            <span className={pill}>{content}</span>
                        )}
                    </li>
                );
            })}
        </ol>
    </nav>
);
