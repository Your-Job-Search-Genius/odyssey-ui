import type { FC } from "react";
import * as Demos from "./dashboard-banner.demo";

export default {
    title: "Application/Dashboard banner",
    decorators: [
        (Story: FC) => (
            <div className="flex min-h-screen items-center justify-center bg-primary p-8">
                <Story />
            </div>
        ),
    ],
};

export const Default = () => <Demos.DashboardBannerDemo />;

/** On the board's section gray (the banner is unfilled, so the PNG shows that gray through it). */
export const Figma = () => (
    <div data-compare className="inline-flex flex-col items-start gap-4 bg-[#565656] p-0">
        <Demos.DashboardBannerDemo />
    </div>
);
