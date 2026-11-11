import type { FC } from "react";
import { ShutterButton } from "@/components/application/headshot/shutter-button";
import * as Demos from "@/components/application/headshot/shutter-button.demo";

export default {
    title: "Application/Headshot/Shutter button",
    decorators: [
        (Story: FC) => (
            <div className="flex min-h-screen w-full items-center justify-center bg-primary p-8">
                <Story />
            </div>
        ),
    ],
};

export const Basic = () => <Demos.BasicDemo />;

export const Disabled = () => <Demos.DisabledDemo />;

export const Progress = () => <Demos.ProgressDemo />;

/** Webcam state 7 (Figma 14777:126114): top and right poses done, bottom current. */
export const FigmaProgress = () => (
    <div data-compare className="inline-flex flex-col items-start bg-[#1E1E1E] p-0">
        <ShutterButton currentStep={2} />
    </div>
);
