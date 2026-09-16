import type { FC } from "react";
import * as Demos from "./radar-chart.demo";

export default {
    title: "Application/Charts/Radar chart",
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

export const Basic = () => <Demos.RadarChartBasic />;
export const SingleSeries = () => <Demos.RadarChartSingleSeries />;
SingleSeries.storyName = "Single series";
export const WithoutDots = () => <Demos.RadarChartWithoutDots />;
WithoutDots.storyName = "Without dots";
