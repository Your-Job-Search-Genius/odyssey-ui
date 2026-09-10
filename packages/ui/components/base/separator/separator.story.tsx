import type { FC } from "react";
import * as SeparatorDemos from "@/components/base/separator/separator.demo";

export default {
    title: "Base components/Separators",
    decorators: [
        (Story: FC) => (
            <div className="flex min-h-screen w-full items-center justify-center bg-primary p-8">
                <Story />
            </div>
        ),
    ],
};

export const Horizontal = () => <SeparatorDemos.HorizontalDemo />;

export const Vertical = () => <SeparatorDemos.VerticalDemo />;

export const Labeled = () => <SeparatorDemos.LabeledDemo />;
Labeled.storyName = "Labeled (OR divider)";

export const Toolbar = () => <SeparatorDemos.ToolbarDemo />;
Toolbar.storyName = "Vertical separators in a toolbar";

export const Decorative = () => <SeparatorDemos.DecorativeDemo />;
Decorative.storyName = "Decorative (no separator role)";

export const InFlexAndGrid = () => <SeparatorDemos.InFlexAndGridDemo />;
InFlexAndGrid.storyName = "Inside flex and grid containers";
