import type { FC } from "react";
import * as Demos from "./funnel-chart.demo";

export default {
    title: "Application/Charts/Funnel",
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

export const Basic = () => <Demos.FunnelChartBasic />;
export const Vertical = () => <Demos.FunnelChartVertical />;
