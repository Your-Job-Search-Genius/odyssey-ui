import type { FC } from "react";
import * as HeadingDemos from "@/components/base/typography/heading.demo";

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

export const Heading = () => <HeadingDemos.Default />;

export const HeadingSizeOverride = () => <HeadingDemos.SizeOverride />;
HeadingSizeOverride.storyName = "Heading (size override)";
