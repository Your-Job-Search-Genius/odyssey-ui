import type { FC } from "react";
import * as Demos from "./flow-canvas.demo";

export default {
    title: "Application/Flow canvas",
    decorators: [
        (Story: FC) => (
            <div className="flex min-h-screen items-start justify-center bg-primary p-8">
                <div className="w-full max-w-5xl">
                    <Story />
                </div>
            </div>
        ),
    ],
};

export const Basic = () => <Demos.FlowCanvasBasic />;
export const Controlled = () => <Demos.FlowCanvasControlled />;
Controlled.storyName = "Controlled state";
export const MinimalEmbed = () => <Demos.FlowCanvasMinimalEmbed />;
MinimalEmbed.storyName = "Minimal embed";
export const CustomRoles = () => <Demos.FlowCanvasCustomRoles />;
CustomRoles.storyName = "Custom roles";
export const Sketchy = () => <Demos.FlowCanvasSketchyMode />;
Sketchy.storyName = "Sketchy style";
export const RunSimulation = () => <Demos.FlowCanvasRunSimulation />;
RunSimulation.storyName = "Run simulation";
export const Empty = () => <Demos.FlowCanvasEmpty />;
