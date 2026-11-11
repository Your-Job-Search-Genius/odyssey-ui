"use client";

import { QRCard } from "@/components/application/headshot/qr-card";
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

/** Phone explainer: nearly the full viewport width (`size="sm"`; `"responsive"` switches at `md`). */
export const PhonePopoverDemo = ({ defaultOpen }: { defaultOpen?: boolean }) => (
    <PopoverTrigger defaultOpen={defaultOpen}>
        <Button size="sm" color="outline-pill">
            Why?
        </Button>
        <Popover size="sm" placement="top" acknowledgeLabel="Okay! Got It">
            Why Description
        </Popover>
    </PopoverTrigger>
);

/** `bare`: rich content (a `QRCard`) brings its own surface; its close button closes the popover. */
export const QRPopoverDemo = ({ defaultOpen }: { defaultOpen?: boolean }) => (
    <PopoverTrigger defaultOpen={defaultOpen}>
        <Button size="md" color="secondary">
            Use Phone Camera
        </Button>
        <Popover variant="bare" placement="right bottom" offset={11} aria-label="Continue on your phone">
            <QRCard value="https://example.com/headshot/capture" caption="Use your phone to take the picture for a better quality" onClose={() => {}} />
        </Popover>
    </PopoverTrigger>
);
