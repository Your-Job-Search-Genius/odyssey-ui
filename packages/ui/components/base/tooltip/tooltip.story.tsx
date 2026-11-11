import type { FC } from "react";
import * as Tooltips from "@/components/base/tooltip/tooltip.demo";

export default {
    title: "Base components/Tooltips",
    decorators: [
        (Story: FC) => (
            <div className="flex min-h-screen items-center justify-center bg-primary p-16">
                <Story />
            </div>
        ),
    ],
};

export const Tooltip = () => <Tooltips.TooltipDemo />;

export const TooltipWithArrow = () => <Tooltips.TooltipWithArrow />;
TooltipWithArrow.storyName = "Tooltip with arrow";

export const TooltipWithArrowSupportingText = () => <Tooltips.TooltipWithArrowSupportingText />;
TooltipWithArrowSupportingText.storyName = "Tooltip with arrow supporting text";

/** BetterShot look: the dark popover surface (#151515, r14, 14/1.4 text). Screenshot `[role=tooltip]`. */
export const Figma = () => <Tooltips.FigmaTooltipDemo />;
