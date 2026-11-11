"use client";

import { GlassPill } from "@/components/application/headshot/glass-pill";
import { PhotoSlot } from "@/components/application/headshot/photo-slot";

const photo = "https://www.untitledui.com/images/avatars/olivia-rhye";

export const StatesDemo = () => (
    <div className="flex flex-wrap gap-3 rounded-[20px] bg-inverse p-4">
        <PhotoSlot status="ok" src={photo} alt="Photo 1" onRetake={() => {}} />
        <PhotoSlot status="fail" src={photo} alt="Photo 2" onReupload={() => {}} whyAction={<GlassPill>Why?</GlassPill>} />
        <PhotoSlot status="pending" src={photo} alt="Photo 3" />
        <PhotoSlot onAdd={() => {}} />
    </div>
);

/** Phone grid: two fluid columns below `md`, fixed 197×261 tiles from `md` up. `label` names each slot. */
export const ResponsiveDemo = () => (
    <div className="grid w-full max-w-[402px] grid-cols-2 gap-x-1 gap-y-2 rounded-[20px] bg-inverse p-4 md:flex md:max-w-none md:flex-wrap md:gap-3">
        <PhotoSlot size="responsive" label="Photo 1" status="fail" src={photo} alt="" onReupload={() => {}} whyAction={<GlassPill>Why?</GlassPill>} />
        <PhotoSlot size="responsive" label="Photo 2" status="ok" src={photo} alt="" onRetake={() => {}} />
        <PhotoSlot size="responsive" label="Photo 3" status="pending" src={photo} alt="" />
        <PhotoSlot size="responsive" label="Photo 4" onAdd={() => {}} />
    </div>
);
