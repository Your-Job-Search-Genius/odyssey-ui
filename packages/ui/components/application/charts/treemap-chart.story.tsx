import type { FC } from "react";
import * as Demos from "./treemap-chart.demo";

export default {
    title: "Application/Charts/Treemap",
    decorators: [
        (Story: FC) => (
            <div className="flex min-h-screen items-start justify-center bg-primary p-8">
                <div className="w-full max-w-3xl">
                    <Story />
                </div>
            </div>
        ),
    ],
};

export const Basic = () => <Demos.TreemapChartBasic />;
export const Flat = () => <Demos.TreemapChartFlat />;
Flat.storyName = "Single level";
