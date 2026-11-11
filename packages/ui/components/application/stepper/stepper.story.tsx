import type { FC } from "react";
import * as Demos from "./stepper.demo";

export default {
    title: "Application/Stepper",
    decorators: [
        (Story: FC) => (
            <div className="flex min-h-screen items-center justify-center bg-primary p-8">
                <Story />
            </div>
        ),
    ],
};

export const Default = () => <Demos.StepperDemo />;

export const Figma = () => (
    <div data-compare className="inline-flex flex-col items-start gap-4 bg-white p-0">
        <Demos.StepperFigmaDemo />
    </div>
);

export const FigmaMobile = () => (
    <div data-compare className="inline-flex flex-col items-start gap-4 bg-white p-0">
        <Demos.StepperFigmaMobileDemo />
    </div>
);
FigmaMobile.globals = { viewport: { value: "mobile" } };
