import type { FC } from "react";
import * as PopoverDemos from "@/components/base/popover/popover.demo";

export default {
    title: "Base components/Popover",
    decorators: [
        (Story: FC) => (
            <div className="flex min-h-screen items-start justify-center bg-primary p-16">
                <Story />
            </div>
        ),
    ],
};

export const Default = () => <PopoverDemos.PopoverDemo />;

/** Screenshot `[role=dialog]`. */
export const Figma = () => <PopoverDemos.FigmaPopoverDemo />;

/** Phone explainer (14893:44379): 385×78 in a 402px viewport. Screenshot `[role=dialog]` at width 402. */
export const FigmaPhone = () => <PopoverDemos.PhonePopoverDemo defaultOpen />;

/** QR popover beside "Use Phone Camera" (14672:526185): `variant="bare"` around a `QRCard`. Screenshot `[role=dialog]`. */
export const FigmaQR = () => <PopoverDemos.QRPopoverDemo defaultOpen />;
