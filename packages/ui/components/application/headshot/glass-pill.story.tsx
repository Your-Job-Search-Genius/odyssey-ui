import type { FC } from "react";
import * as Demos from "@/components/application/headshot/glass-pill.demo";

export default {
    title: "Application/Headshot/Glass pill",
    decorators: [
        (Story: FC) => (
            <div className="flex min-h-screen w-full items-center justify-center bg-primary p-8">
                <Story />
            </div>
        ),
    ],
};

export const Dark = () => <Demos.DarkDemo />;

export const Light = () => <Demos.LightDemo />;
