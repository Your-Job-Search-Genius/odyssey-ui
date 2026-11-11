import type { FC } from "react";
import { GeneratingCard, GeneratingHeader } from "@/components/application/headshot/generating-card";
import * as Demos from "@/components/application/headshot/generating-card.demo";
import { StatusBadge } from "@/components/base/badges/badges";
import { Button } from "@/components/base/buttons/button";
import { HelpCircleIcon } from "@/components/foundations/hugeicons";

const face = new URL("./story-assets/face.jpg", import.meta.url).href;
const hair = new URL("./story-assets/hair.png", import.meta.url).href;
const logo = new URL("./story-assets/logo.svg", import.meta.url).href;

export default {
    title: "Application/Headshot/Generating card",
    decorators: [
        (Story: FC) => (
            <div className="flex min-h-screen w-full items-center justify-center bg-primary p-8 max-md:p-0">
                <Story />
            </div>
        ),
    ],
};

export const Basic = () => <Demos.BasicDemo />;

const inputs = [
    { src: face, alt: "Your photo", tag: "Clothes" },
    { src: hair, alt: "Background reference", tag: "Background", tone: "purple" as const },
    { src: hair, alt: "Hairstyle reference", tag: "Hairstyle", tone: "sky" as const },
];

const stages = (
    <div role="group" aria-label="Progress" className="flex gap-px">
        <StatusBadge status="done">Learning</StatusBadge>
        <StatusBadge status="done">Shooting</StatusBadge>
        <StatusBadge status="active">Polish</StatusBadge>
        <StatusBadge status="pending">Ready</StatusBadge>
    </div>
);

export const Figma = () => (
    <div data-compare className="inline-flex flex-col items-start gap-4 bg-white px-[3.5px] py-[3px]">
        <GeneratingCard className="w-[768px]" logo={<img src={logo} alt="BetterShot" className="h-10 w-[62px]" />} inputs={inputs} />
    </div>
);

/** Phone frame `14839:181159` (402 wide), cropped to the card: y 313-672. Shoot at a 402px viewport. */
export const FigmaPhone = () => (
    <div data-compare className="w-[402px] bg-white px-1.5 pt-1.5">
        <GeneratingCard className="w-[390px]" logo={<img src={logo} alt="BetterShot" className="h-10 w-[62px]" />} inputs={inputs} stages={stages} />
    </div>
);

/** Phone frame header (`14839:181187`, 292x118): 20px title. */
export const FigmaPhoneHeader = () => (
    <div data-compare className="w-[292px] bg-white">
        <GeneratingHeader headingLevel={1} title="Learning your Face" description="Usually ready in 45-90 minutes. Safe to close - we’ll email you.">
            <Button size="sm" color="outline-pill" iconTrailing={HelpCircleIcon}>
                Why does this takes time
            </Button>
        </GeneratingHeader>
    </div>
);
