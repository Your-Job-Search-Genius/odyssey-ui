import type { FC } from "react";
import * as Demos from "./sankey-chart.demo";

export default {
    title: "Application/Charts/Sankey",
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

export const Basic = () => <Demos.SankeyChartBasic />;
export const Simple = () => <Demos.SankeyChartSimple />;
