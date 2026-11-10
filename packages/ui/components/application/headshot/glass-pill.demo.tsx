"use client";

import { GlassPill } from "@/components/application/headshot/glass-pill";
import { RefreshIcon } from "@/components/foundations/hugeicons";

export const DarkDemo = () => (
    <div className="relative flex h-40 w-72 items-end justify-between overflow-hidden rounded-[21px] p-2.5">
        <img src="https://www.untitledui.com/images/avatars/olivia-rhye" alt="" className="absolute inset-0 size-full object-cover" />
        <GlassPill className="relative">Why?</GlassPill>
        <GlassPill iconLeading={RefreshIcon} className="relative">
            Re-Take
        </GlassPill>
    </div>
);

export const LightDemo = () => (
    <div className="rounded-3xl bg-black/80 p-4">
        <GlassPill variant="light" className="h-[41px]">
            Skip this photo
        </GlassPill>
    </div>
);
