import type { FC } from "react";
import * as PlayButtonIconDemos from "@/components/foundations/play-button-icon.demo";

export default {
    title: "Foundations/Play button icon",
    decorators: [
        (Story: FC) => (
            <div className="flex min-h-screen w-full items-center justify-center bg-primary p-8">
                <Story />
            </div>
        ),
    ],
};

export const Basic = () => <PlayButtonIconDemos.BasicDemo />;

export const Interactive = () => <PlayButtonIconDemos.InteractiveDemo />;
