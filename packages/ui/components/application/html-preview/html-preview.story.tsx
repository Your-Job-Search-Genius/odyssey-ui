import type { FC } from "react";
import * as Demos from "./html-preview.demo";

export default {
    title: "Application/HTML preview",
    decorators: [
        (Story: FC) => (
            <div className="flex min-h-screen items-start justify-center bg-primary p-8">
                <Story />
            </div>
        ),
    ],
};

export const Default = () => <Demos.DefaultDemo />;
export const AutoHeight = () => <Demos.AutoHeightDemo />;
AutoHeight.storyName = "Auto height";
