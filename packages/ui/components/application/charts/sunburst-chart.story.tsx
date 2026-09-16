import type { FC } from "react";
import * as Demos from "./sunburst-chart.demo";

export default {
    title: "Application/Charts/Sunburst",
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

export const Basic = () => <Demos.SunburstChartBasic />;
export const CustomCenter = () => <Demos.SunburstChartCustomCenter />;
CustomCenter.storyName = "Custom centre";
