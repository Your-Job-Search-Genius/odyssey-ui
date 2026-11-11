"use client";

import { GeneratingCard, GeneratingHeader } from "@/components/application/headshot/generating-card";
import { StatusBadge } from "@/components/base/badges/badges";

const inputs = [
    { src: "https://www.untitledui.com/images/avatars/olivia-rhye", alt: "Your photo", tag: "Clothes" },
    { src: "https://www.untitledui.com/images/avatars/phoenix-baker", alt: "Background reference", tag: "Background", tone: "purple" as const },
    { src: "https://www.untitledui.com/images/avatars/lana-steiner", alt: "Hairstyle reference", tag: "Hairstyle", tone: "sky" as const },
];

export const BasicDemo = () => (
    <div className="flex w-full flex-col items-center gap-8">
        <GeneratingHeader headingLevel={1} title="Learning your Face" description="Usually ready in 45-90 minutes. Safe to close - we’ll email you." />
        <GeneratingCard
            inputs={inputs}
            logo={<span className="text-lg font-semibold text-primary">Logo</span>}
            stages={
                <div role="group" aria-label="Progress" className="flex gap-px">
                    <StatusBadge status="done">Learning</StatusBadge>
                    <StatusBadge status="active">Shooting</StatusBadge>
                    <StatusBadge status="pending">Polish</StatusBadge>
                    <StatusBadge status="pending">Ready</StatusBadge>
                </div>
            }
        />
    </div>
);
