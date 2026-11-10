import type { FC } from "react";
import { ThumbStrip } from "@/components/application/headshot/thumb-strip";
import * as Demos from "@/components/application/headshot/thumb-strip.demo";

const face = new URL("./story-assets/face.jpg", import.meta.url).href;

export default {
    title: "Application/Headshot/Thumb strip",
    decorators: [
        (Story: FC) => (
            <div className="flex min-h-screen w-full items-center justify-center bg-primary p-8">
                <Story />
            </div>
        ),
    ],
};

export const Basic = () => <Demos.BasicDemo />;

export const Figma = () => (
    <div data-compare className="inline-flex flex-col items-start gap-4 bg-white p-0">
        <ThumbStrip photos={[{ src: face, alt: "Photo 1" }]} slots={5} />
    </div>
);
