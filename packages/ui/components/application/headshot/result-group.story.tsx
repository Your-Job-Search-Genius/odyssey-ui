import type { FC } from "react";
import { ResultGroup } from "@/components/application/headshot/result-group";
import * as Demos from "@/components/application/headshot/result-group.demo";
import { ResultTile } from "@/components/application/headshot/result-tile";

const face = new URL("./story-assets/face.jpg", import.meta.url).href;
const portrait = new URL("./story-assets/portrait.jpg", import.meta.url).href;
const noop = () => {};

export default {
    title: "Application/Headshot/Result group",
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
    <div data-compare className="inline-flex w-[478px] flex-col items-start gap-4 bg-white p-0">
        <ResultGroup thumbnail={{ src: portrait, alt: "" }} eyebrow="OUTFIT 1" count={2} countLabel="Photos" title="White T-Shirt and Leather Jacket">
            <ResultTile src={face} alt="Headshot 1" onFavoriteChange={noop} onOpen={noop} onDownload={noop} />
            <ResultTile src={portrait} alt="Headshot 2" isFavorite onFavoriteChange={noop} onOpen={noop} onDownload={noop} />
        </ResultGroup>
    </div>
);
