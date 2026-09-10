import type { FC } from "react";
import * as SectionDividerDemos from "@/components/shared-assets/section-divider.demo";

export default {
    title: "Shared Assets/Section divider",
    decorators: [
        (Story: FC) => (
            <div className="flex min-h-screen w-full items-center justify-center bg-primary p-8">
                <Story />
            </div>
        ),
    ],
};

export const Basic = () => <SectionDividerDemos.BasicDemo />;
