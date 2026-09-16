import type { FC } from "react";
import * as Demos from "./scatter-chart.demo";

export default {
    title: "Application/Charts/Scatter chart",
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

export const Basic = () => <Demos.ScatterChartBasic />;
export const Bubble = () => <Demos.ScatterChartBubble />;
export const Categories = () => <Demos.ScatterChartCategories />;
