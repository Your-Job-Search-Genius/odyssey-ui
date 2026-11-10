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
