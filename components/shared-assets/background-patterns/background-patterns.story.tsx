import type { FC } from "react";
import * as BackgroundPatternDemos from "@/components/shared-assets/background-patterns/background-patterns.demo";

export default {
    title: "Shared Assets/Background patterns",
    decorators: [
        (Story: FC) => (
            <div className="flex min-h-screen w-full items-center justify-center bg-primary p-8">
                <Story />
            </div>
        ),
    ],
};

export const Basic = () => <BackgroundPatternDemos.BasicDemo />;

export const AllPatterns = () => <BackgroundPatternDemos.AllPatternsDemo />;

export const Sizes = () => <BackgroundPatternDemos.SizesDemo />;
