import type { FC } from "react";
import * as CaptionDemos from "@/components/base/typography/caption.demo";

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

export const Caption = () => <CaptionDemos.Default />;
