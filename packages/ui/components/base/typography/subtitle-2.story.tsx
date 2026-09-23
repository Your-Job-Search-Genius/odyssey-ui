import type { FC } from "react";
import * as Subtitle2Demos from "@/components/base/typography/subtitle-2.demo";

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

export const Subtitle2 = () => <Subtitle2Demos.Default />;
