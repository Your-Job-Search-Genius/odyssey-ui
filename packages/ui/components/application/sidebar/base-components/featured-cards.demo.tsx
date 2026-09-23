"use client";

import type { ReactNode } from "react";
import { Button } from "@/components/base/buttons/button";
import { CloseButton } from "@/components/base/buttons/close-button";
import { ProgressBarCircle } from "@/components/base/progress-indicators/progress-circles";
import { ProgressBar } from "@/components/base/progress-indicators/progress-indicators";
import { cx } from "@/utils/cx";

interface FeaturedCardCommonProps {
    title?: string;
    description?: ReactNode;
    confirmLabel?: string;
    className?: string;
    onDismiss?: () => void;
    onConfirm?: () => void;
}

const noop = () => {};

export const FeaturedCardProgressBar = ({
    title = "Used space",
    description = "Your team has used 80% of your available space. Need more?",
    confirmLabel = "Upgrade plan",
    progress = 80,
    className,
    onDismiss = noop,
    onConfirm = noop,
}: FeaturedCardCommonProps & {
    progress?: number;
}) => {
    return (
        <div className={cx("relative flex flex-col rounded-xl bg-secondary p-4", className)}>
            <p className="text-sm font-semibold text-primary">{title}</p>
            <p className="mt-1 text-sm text-tertiary">{description}</p>

            <div className="absolute top-1 right-1">
                <CloseButton onClick={onDismiss} size="sm" />
            </div>

            <div className="mt-4 flex">
                <ProgressBar value={progress} />
            </div>

            <div className="mt-4 flex gap-3">
                <Button onClick={onDismiss} color="link-gray" size="sm">
                    Dismiss
                </Button>
                <Button onClick={onConfirm} color="link-color" size="sm">
                    {confirmLabel}
                </Button>
            </div>
        </div>
    );
};

export const FeaturedCardProgressCircle = ({
    title = "Used space",
    description = "Your team has used 80% of your available space. Need more?",
    confirmLabel = "Upgrade plan",
    progress = 80,
    className,
    onDismiss = noop,
    onConfirm = noop,
}: FeaturedCardCommonProps & {
    progress?: number;
}) => {
    return (
        <div className={cx("relative flex flex-col rounded-xl bg-secondary p-4", className)}>
            <div className="w-16">
                <ProgressBarCircle value={progress} size="xxs" />
            </div>

            <div className="absolute top-1 right-1">
                <CloseButton onClick={onDismiss} size="sm" />
            </div>
            <div className="mt-3">
                <p className="text-sm font-semibold text-primary">{title}</p>
                <p className="mt-1 text-sm text-tertiary">{description}</p>
            </div>
            <div className="mt-4 flex gap-3">
                <Button onClick={onDismiss} color="link-gray" size="sm">
                    Dismiss
                </Button>
                <Button onClick={onConfirm} color="link-color" size="sm">
                    {confirmLabel}
                </Button>
            </div>
        </div>
    );
};
