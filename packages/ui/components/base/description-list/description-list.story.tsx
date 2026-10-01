import type { FC } from "react";
import * as Demos from "./description-list.demo";

export default {
    title: "Base/Description list",
    decorators: [
        (Story: FC) => (
            <div className="flex min-h-screen items-start justify-center bg-primary p-8">
                <Story />
            </div>
        ),
    ],
};

export const Default = () => <Demos.DefaultDemo />;
export const Inline = () => <Demos.InlineDemo />;
Inline.storyName = "Inline, divided";
