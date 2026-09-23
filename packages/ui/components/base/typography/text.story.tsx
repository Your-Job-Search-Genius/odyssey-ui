import type { FC } from "react";
import * as TextDemos from "@/components/base/typography/text.demo";

export default {
    title: "Base components/Typography",
    decorators: [
        (Story: FC) => (
            <div className="flex min-h-screen w-full items-center justify-center bg-primary p-8">
                <Story />
            </div>
        ),
    ],
};

export const Text = () => <TextDemos.Default />;

export const TextSizes = () => <TextDemos.Sizes />;
TextSizes.storyName = "Text (sizes)";

export const TextColors = () => <TextDemos.Colors />;
TextColors.storyName = "Text (colors)";
