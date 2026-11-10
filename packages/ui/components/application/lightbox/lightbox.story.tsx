import type { FC } from "react";
import * as LightboxDemos from "@/components/application/lightbox/lightbox.demo";

export default {
    title: "Application/Lightbox",
    decorators: [
        (Story: FC) => (
            <div className="flex min-h-screen w-full items-center justify-center bg-secondary p-4">
                <Story />
            </div>
        ),
    ],
};

export const Default = () => <LightboxDemos.LightboxDemo />;

/** Open, for comparison with Figma at 1440x824. Screenshot `[role=dialog]`. */
export const Figma = () => <LightboxDemos.LightboxDemo defaultOpen />;
