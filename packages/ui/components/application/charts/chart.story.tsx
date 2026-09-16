import type { FC } from "react";
import * as Palette from "./chart-palette.demo";
import * as Demos from "./chart.demo";

export default {
    title: "Application/Charts/Foundations",
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

export const CustomChart = () => <Demos.CustomLollipopChart />;
CustomChart.storyName = "Custom chart on the Chart root";
export const PaletteCategorical = () => <Palette.ChartPaletteCategorical />;
PaletteCategorical.storyName = "Palette: categorical";
export const PaletteRamps = () => <Palette.ChartPaletteRamps />;
PaletteRamps.storyName = "Palette: ramps";
