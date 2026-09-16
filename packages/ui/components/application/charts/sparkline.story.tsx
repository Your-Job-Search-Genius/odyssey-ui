import type { FC } from "react";
import * as Demos from "./sparkline.demo";

export default {
    title: "Application/Charts/Sparkline",
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

export const Line = () => <Demos.SparklineLine />;
export const Area = () => <Demos.SparklineArea />;
export const Bar = () => <Demos.SparklineBar />;
