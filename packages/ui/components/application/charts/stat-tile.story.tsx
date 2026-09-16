import type { FC } from "react";
import * as Demos from "./stat-tile.demo";

export default {
    title: "Application/Charts/Stat tile",
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

export const Basic = () => <Demos.StatTileBasic />;
export const WithTrend = () => <Demos.StatTileWithTrend />;
WithTrend.storyName = "With trend";
export const Group = () => <Demos.StatTileGroupDemo />;
export const Sizes = () => <Demos.StatTileSizes />;
