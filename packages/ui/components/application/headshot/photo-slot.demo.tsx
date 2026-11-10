"use client";

import { GlassPill } from "@/components/application/headshot/glass-pill";
import { PhotoSlot } from "@/components/application/headshot/photo-slot";

const photo = "https://www.untitledui.com/images/avatars/olivia-rhye";

export const StatesDemo = () => (
    <div className="flex flex-wrap gap-3 rounded-[20px] bg-inverse p-4">
        <PhotoSlot status="ok" src={photo} alt="Photo 1" onRetake={() => {}} />
        <PhotoSlot status="fail" src={photo} alt="Photo 2" onReupload={() => {}} whyAction={<GlassPill>Why?</GlassPill>} />
        <PhotoSlot onAdd={() => {}} />
    </div>
);
