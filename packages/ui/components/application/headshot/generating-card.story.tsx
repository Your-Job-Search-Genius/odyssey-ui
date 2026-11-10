import type { FC } from "react";
import { GeneratingCard } from "@/components/application/headshot/generating-card";
import * as Demos from "@/components/application/headshot/generating-card.demo";

const face = new URL("./story-assets/face.jpg", import.meta.url).href;
const hair = new URL("./story-assets/hair.png", import.meta.url).href;
const logo = new URL("./story-assets/logo.svg", import.meta.url).href;

export default {
    title: "Application/Headshot/Generating card",
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
    <div data-compare className="inline-flex flex-col items-start gap-4 bg-white px-[3.5px] py-[3px]">
        <GeneratingCard
            className="w-[768px]"
            logo={<img src={logo} alt="BetterShot" className="h-10 w-[62px]" />}
            inputs={[
                { src: face, alt: "Your photo", tag: "Clothes" },
                { src: hair, alt: "Background reference", tag: "Background", tone: "purple" },
                { src: hair, alt: "Hairstyle reference", tag: "Hairstyle", tone: "sky" },
            ]}
        />
    </div>
);
