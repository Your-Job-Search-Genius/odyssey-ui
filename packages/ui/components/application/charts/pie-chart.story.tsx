import type { FC } from "react";
import * as Demos from "./pie-chart.demo";

export default {
    title: "Application/Charts/Pie chart",
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

export const Donut = () => <Demos.PieChartDonut />;
export const Pie = () => <Demos.PieChartPie />;
export const LegendBottom = () => <Demos.PieChartLegendBottom />;
LegendBottom.storyName = "Legend bottom";
export const FoldedOther = () => <Demos.PieChartFoldedOther />;
FoldedOther.storyName = "Folded into Other";
export const CustomCenter = () => <Demos.PieChartCustomCenter />;
CustomCenter.storyName = "Custom centre";
