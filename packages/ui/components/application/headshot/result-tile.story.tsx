import type { FC } from "react";
import { ResultTile } from "@/components/application/headshot/result-tile";
import * as Demos from "@/components/application/headshot/result-tile.demo";

const face = new URL("./story-assets/face.jpg", import.meta.url).href;
const noop = () => {};

export default {
    title: "Application/Headshot/Result tile",
    decorators: [
        (Story: FC) => (
            <div className="flex min-h-screen w-full items-center justify-center bg-primary p-8">
                <Story />
            </div>
        ),
    ],
};

export const Basic = () => <Demos.BasicDemo />;

/** Figma component set: `default` and `onHover` (forced visible here). */
export const Figma = () => (
    <div data-compare className="inline-flex gap-[14px] bg-[#626262] p-5">
        <ResultTile src={face} alt="Headshot 1" onOpen={noop} onDownload={noop} />
        <ResultTile src={face} alt="Headshot 1" onOpen={noop} onDownload={noop} className="[&_button]:opacity-100" />
    </div>
);
