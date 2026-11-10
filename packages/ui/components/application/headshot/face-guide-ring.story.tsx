import type { FC } from "react";
import { FaceGuideRing } from "@/components/application/headshot/face-guide-ring";
import * as Demos from "@/components/application/headshot/face-guide-ring.demo";
import { ShutterButton } from "@/components/application/headshot/shutter-button";
import { cx } from "@/utils/cx";

const face = new URL("./story-assets/face.jpg", import.meta.url).href;

export default {
    title: "Application/Headshot/Face guide ring",
    decorators: [
        (Story: FC) => (
            <div className="flex min-h-screen w-full items-center justify-center bg-primary p-8">
                <Story />
            </div>
        ),
    ],
};

export const Neutral = () => <Demos.NeutralDemo />;

export const Statuses = () => <Demos.StatusesDemo />;

// Figma's crop of the photo inside the 308×334 mask box.
const FigmaFace = ({ blurry }: { blurry?: boolean }) => (
    <img src={face} alt="" className={cx("absolute top-[-15px] left-[-244px] h-[530px] w-[795px] max-w-none", blurry && "blur-[2px]")} />
);

export const Figma = () => (
    <div data-compare className="inline-flex flex-col items-start gap-4 bg-white p-0 px-[4.5px]">
        <FaceGuideRing status="good">
            <FigmaFace blurry />
        </FaceGuideRing>
    </div>
);

/** Ring + shutter inside a stand-in for the camera dialog shell (the shell itself is the Modal's). */
export const FigmaCamera = () => (
    <div data-compare className="inline-flex flex-col items-start gap-4 bg-white p-0">
        <div className="relative h-[667px] w-[362px] rounded-[28px] bg-[#444]">
            <span className="absolute top-5 left-1/2 -translate-x-1/2 rounded-[15px] bg-black/32 px-2.5 py-[5px] text-sm leading-[1.3] font-medium text-white">
                Take Selfie
            </span>
            <span className="absolute top-[21px] right-[19px] size-6.5 rounded-lg bg-white" />
            <div className="absolute top-[73px] left-1/2 flex w-[282px] -translate-x-1/2 flex-col gap-1 text-center">
                <p className="text-xl/[1.3] font-semibold text-white">Look straight at the camera</p>
                <p className="text-sm/[1.3] text-[#AEB1B9]">Keep your head still and look directly ahead.</p>
            </div>
            <FaceGuideRing className="absolute top-[170.5px] left-[31.5px]">
                <FigmaFace />
            </FaceGuideRing>
            <ShutterButton caption="Click the button above to take photo" className="absolute top-[554px] left-1/2 -translate-x-1/2" />
        </div>
    </div>
);
