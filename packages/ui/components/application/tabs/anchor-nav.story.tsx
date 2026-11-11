import type { FC } from "react";
import * as Demos from "./anchor-nav.demo";

export default {
    title: "Application/Anchor nav",
    decorators: [
        (Story: FC) => (
            <div className="flex min-h-screen items-center justify-center bg-primary p-8">
                <Story />
            </div>
        ),
    ],
};

export const Default = () => <Demos.AnchorNavDemo />;

/** Figma P21 (`14853:207258`): Facial Features current. */
export const Figma = () => (
    <div data-compare className="inline-flex flex-col items-start gap-4 bg-white p-0">
        <Demos.AnchorNavDemo />
    </div>
);
