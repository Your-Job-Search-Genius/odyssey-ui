"use client";

import { FaceGuideRing } from "@/components/application/headshot/face-guide-ring";

const Face = () => <img src="https://www.untitledui.com/images/avatars/olivia-rhye" alt="" className="size-full object-cover" />;

export const NeutralDemo = () => (
    <div className="rounded-[28px] bg-inverse p-8">
        <FaceGuideRing>
            <Face />
        </FaceGuideRing>
    </div>
);

export const StatusesDemo = () => (
    <div className="flex flex-wrap gap-8 rounded-[28px] bg-inverse p-8">
        <FaceGuideRing status="good">
            <Face />
        </FaceGuideRing>
        <FaceGuideRing status="bad">
            <Face />
        </FaceGuideRing>
    </div>
);
