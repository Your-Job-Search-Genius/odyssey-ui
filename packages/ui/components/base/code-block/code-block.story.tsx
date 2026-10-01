import type { FC } from "react";
import * as Demos from "./code-block.demo";

export default {
    title: "Base/Code block",
    decorators: [
        (Story: FC) => (
            <div className="flex min-h-screen items-start justify-center bg-primary p-8">
                <Story />
            </div>
        ),
    ],
};

export const Default = () => <Demos.DefaultDemo />;
export const Wrapped = () => <Demos.WrappedDemo />;
export const Scrolling = () => <Demos.ScrollingDemo />;
export const NoChrome = () => <Demos.NoChromeDemo />;
NoChrome.storyName = "Without caption or copy";
