import type { FC } from "react";
import * as Demos from "./bar-chart.demo";

export default {
    title: "Application/Charts/Bar chart",
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

export const Basic = () => <Demos.BarChartBasic />;
export const Grouped = () => <Demos.BarChartGrouped />;
export const Stacked = () => <Demos.BarChartStacked />;
export const Horizontal = () => <Demos.BarChartHorizontal />;
export const Diverging = () => <Demos.BarChartDiverging />;
export const WithValues = () => <Demos.BarChartWithValues />;
WithValues.storyName = "With values";
export const LiveUpdate = () => <Demos.BarChartLiveUpdate />;
LiveUpdate.storyName = "Live update";
export const Empty = () => <Demos.BarChartEmpty />;
