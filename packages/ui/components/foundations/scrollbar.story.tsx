import type { FC } from "react";
import * as ScrollbarDemos from "@/components/foundations/scrollbar.demo";

export default {
    title: "Foundations/Scrollbar",
    decorators: [
        (Story: FC) => (
            <div className="flex min-h-screen w-full items-center justify-center bg-primary p-8">
                <Story />
            </div>
        ),
    ],
};

export const Default = () => <ScrollbarDemos.DefaultDemo />;

export const AllVariants = () => <ScrollbarDemos.AllVariantsDemo />;

export const Ruled = () => <ScrollbarDemos.RuledDemo />;

export const Hairline = () => <ScrollbarDemos.HairlineDemo />;

export const Pill = () => <ScrollbarDemos.PillDemo />;

export const Overlay = () => <ScrollbarDemos.OverlayDemo />;

export const Ink = () => <ScrollbarDemos.InkDemo />;

export const Rail = () => <ScrollbarDemos.RailDemo />;

export const Hidden = () => <ScrollbarDemos.HiddenDemo />;
