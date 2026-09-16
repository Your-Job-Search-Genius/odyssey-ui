import type { FC } from "react";
import * as Demos from "./radial-chart.demo";

export default {
    title: "Application/Charts/Radial chart",
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

export const Rings = () => <Demos.RadialChartRings />;
export const Gauge = () => <Demos.RadialChartGauge />;
export const Progress = () => <Demos.RadialChartProgress />;
export const ProgressSizes = () => <Demos.RadialChartProgressSizes />;
ProgressSizes.storyName = "Progress sizes";
