import type { FC } from "react";
import * as Demos from "./heatmap-chart.demo";

export default {
    title: "Application/Charts/Heatmap",
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

export const Calendar = () => <Demos.HeatmapChartCalendar />;
export const Matrix = () => <Demos.HeatmapChartMatrix />;
Matrix.storyName = "Matrix with values";
export const Diverging = () => <Demos.HeatmapChartDiverging />;
export const Empty = () => <Demos.HeatmapChartEmpty />;
