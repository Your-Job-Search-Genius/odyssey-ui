import type { FC } from "react";
import { GlassPill } from "@/components/application/headshot/glass-pill";
import { PhotoSlot } from "@/components/application/headshot/photo-slot";
import * as Demos from "@/components/application/headshot/photo-slot.demo";

const portrait = new URL("./story-assets/portrait.jpg", import.meta.url).href;

export default {
    title: "Application/Headshot/Photo slot",
    decorators: [
        (Story: FC) => (
            <div className="flex min-h-screen w-full items-center justify-center bg-primary p-8">
                <Story />
            </div>
        ),
    ],
};

export const States = () => <Demos.StatesDemo />;

export const Responsive = () => <Demos.ResponsiveDemo />;

export const Figma = () => (
    <div data-compare className="inline-flex flex-col items-start gap-4 bg-[#444] p-0">
        <PhotoSlot status="ok" src={portrait} alt="Photo 1" onRetake={() => {}} />
    </div>
);

/** Slots inside a stand-in for the "Add Photo" dialog shell (the shell itself is the Modal's). */
export const FigmaModal = () => (
    <div data-compare className="inline-flex flex-col items-start gap-4 bg-white p-0">
        <div className="flex h-[628px] w-[647px] flex-col gap-4 rounded-[20px] bg-[#444] p-4">
            <div className="flex items-center justify-between">
                <div className="flex flex-col gap-0.5">
                    <p className="text-xl/[1.3] font-semibold text-white">Add Photo</p>
                    <p className="text-sm/[1.3] font-medium text-[#C1C1C1]">Select the closest match. Same clothes, different person.</p>
                </div>
                <span className="flex h-9 items-center rounded-[9px] bg-white px-[7px] text-md font-medium text-primary opacity-50">Continue 1/5</span>
            </div>
            <div className="flex w-[615px] flex-wrap gap-3">
                <PhotoSlot status="fail" src={portrait} alt="Photo 1" onReupload={() => {}} whyAction={<GlassPill>Why?</GlassPill>} />
                <PhotoSlot onAdd={() => {}} />
                <PhotoSlot onAdd={() => {}} />
                <PhotoSlot onAdd={() => {}} />
                <PhotoSlot onAdd={() => {}} />
            </div>
        </div>
    </div>
);

/** Phone tiles (Figma 14846:189349, first row): fluid 183×242 in a 370px two-column grid. */
export const FigmaPhone = () => (
    <div data-compare className="inline-grid w-[370px] grid-cols-2 gap-x-1 bg-[#444] p-0">
        <PhotoSlot
            size="sm"
            label="Photo 1"
            status="fail"
            src={portrait}
            alt=""
            failLabel="Failed"
            onReupload={() => {}}
            whyAction={<GlassPill>Why?</GlassPill>}
        />
        <PhotoSlot size="sm" label="Photo 2" status="ok" src={portrait} alt="" onRetake={() => {}} />
    </div>
);
