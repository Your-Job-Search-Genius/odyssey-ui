import type { FC } from "react";
import * as DotIconDemos from "@/components/foundations/dot-icon.demo";

export default {
    title: "Foundations/Dot icon",
    decorators: [
        (Story: FC) => (
            <div className="flex min-h-screen w-full items-center justify-center bg-primary p-8">
                <Story />
            </div>
        ),
    ],
};

export const Basic = () => <DotIconDemos.BasicDemo />;

export const Sizes = () => <DotIconDemos.SizesDemo />;

export const Colors = () => <DotIconDemos.ColorsDemo />;
