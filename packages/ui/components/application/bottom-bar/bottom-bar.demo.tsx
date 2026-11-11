"use client";

import { BottomBar, BottomBarPill } from "@/components/application/bottom-bar/bottom-bar";
import { Button } from "@/components/base/buttons/button";
import { ArrowRight02SharpIcon, InformationCircleIcon } from "@/components/foundations/hugeicons";

/** The Figma selection bar: "Your Selection 1/1 (i)" and "Continue to Review". Shown at every width here (`md:block`). */
export const BottomBarDemo = ({ className }: { className?: string }) => (
    <BottomBar className={className ?? "md:block"}>
        <BottomBarPill>
            Your Selection
            <span className="flex items-center gap-1">
                <span className="flex items-center">
                    <span className="relative flex size-6 items-center justify-center">
                        <svg aria-hidden="true" viewBox="0 0 24 24" className="absolute inset-0 size-6">
                            <circle
                                cx="12"
                                cy="12"
                                r="10.5"
                                fill="none"
                                stroke="#DBD8FF"
                                strokeWidth="2"
                                strokeLinecap="round"
                                pathLength="360"
                                strokeDasharray="99 21"
                                transform="rotate(51 12 12)"
                            />
                        </svg>
                        1
                    </span>
                    /1
                </span>
                <button
                    type="button"
                    aria-label="About your selection"
                    className="flex cursor-pointer rounded-full outline-focus-ring focus-visible:outline-2 focus-visible:outline-offset-2"
                >
                    <InformationCircleIcon aria-hidden="true" className="size-6" />
                </button>
            </span>
        </BottomBarPill>
        <Button size="md" iconTrailing={ArrowRight02SharpIcon} className="font-semibold">
            Continue to Review
        </Button>
    </BottomBar>
);
