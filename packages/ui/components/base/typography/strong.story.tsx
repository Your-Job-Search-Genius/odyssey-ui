import type { FC } from "react";
import * as StrongDemos from "@/components/base/typography/strong.demo";

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

export const Strong = () => <StrongDemos.Default />;
