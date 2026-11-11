import type { FC } from "react";
import { ThumbStrip } from "@/components/application/headshot/thumb-strip";
import * as Demos from "@/components/application/headshot/thumb-strip.demo";

const face = new URL("./story-assets/face.jpg", import.meta.url).href;
const portrait = new URL("./story-assets/portrait.jpg", import.meta.url).href;

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

/** Per-photo crop and rotation, with the current photo ringed. */
export const Cropped = () => (
    <div data-compare className="inline-flex flex-col items-start gap-4 bg-inverse p-4">
        <ThumbStrip
            photos={[
                { src: portrait, alt: "Photo 1 (uncropped)" },
                { src: portrait, alt: "Photo 2 (face crop)", crop: { x: 0.3, y: 0.1, size: 0.4 } },
                { src: portrait, alt: "Photo 3 (turned 90°)", rotation: 90 },
                { src: portrait, alt: "Photo 4 (turned 270°, cropped)", rotation: 270, crop: { x: 0.2, y: 0.25, size: 0.35 } },
            ]}
            slots={5}
            selectedIndex={1}
        />
    </div>
);
