import type { FC } from "react";
import * as Body1Demos from "@/components/base/typography/body-1.demo";

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

export const Body1 = () => <Body1Demos.Default />;
