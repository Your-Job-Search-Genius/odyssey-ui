import type { FC } from "react";
import * as Demos from "./line-chart.demo";

export default {
    title: "Application/Charts/Line chart",
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

export const Basic = () => <Demos.LineChartBasic />;
export const EndLabels = () => <Demos.LineChartEndLabels />;
EndLabels.storyName = "End labels";
export const Area = () => <Demos.LineChartArea />;
export const StackedArea = () => <Demos.LineChartStackedArea />;
StackedArea.storyName = "Stacked area";
export const Step = () => <Demos.LineChartStep />;
export const WithTable = () => <Demos.LineChartWithTable />;
WithTable.storyName = "With visible table";
export const LiveUpdate = () => <Demos.LineChartLiveUpdate />;
LiveUpdate.storyName = "Live update";
export const Empty = () => <Demos.LineChartEmpty />;
