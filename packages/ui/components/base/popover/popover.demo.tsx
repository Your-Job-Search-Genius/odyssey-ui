"use client";

import { Button } from "@/components/base/buttons/button";
import { HelpCircleIcon } from "@/components/foundations/hugeicons";
import { Popover, PopoverTrigger } from "./popover";

export const PopoverDemo = ({ defaultOpen }: { defaultOpen?: boolean }) => (
    <PopoverTrigger defaultOpen={defaultOpen}>
        <Button size="sm" color="outline-pill" iconTrailing={HelpCircleIcon}>
            Why this takes time
        </Button>
        <Popover acknowledgeLabel="Okay! Got It">
            We train a private, secure model on your selfies, then generate and polish every look. Expect 45–90 minutes.
        </Popover>
    </PopoverTrigger>
);

/** The Figma example: placeholder copy, opened. */
export const FigmaPopoverDemo = () => (
    <PopoverTrigger defaultOpen>
        <Button size="sm" color="outline-pill">
            Why?
        </Button>
        <Popover acknowledgeLabel="Okay! Got It">Why Description</Popover>
    </PopoverTrigger>
);
