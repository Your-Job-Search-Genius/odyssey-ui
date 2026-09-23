import type { FC } from "react";
import * as Body2Demos from "@/components/base/typography/body-2.demo";

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

export const Body2 = () => <Body2Demos.Default />;
