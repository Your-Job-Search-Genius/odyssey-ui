import type { FC, ReactNode } from "react";
import { Button } from "@/components/base/buttons/button";
import * as Buttons from "@/components/base/buttons/buttons.demo";
import { CloseButton } from "@/components/base/buttons/close-button";
import { ArrowRight02SharpIcon, HelpCircleIcon } from "@/components/foundations/hugeicons";

export default {
    title: "Base components/Buttons",
    decorators: [
        (Story: FC) => (
            <div className="flex min-h-screen w-full bg-primary p-4">
                <Story />
            </div>
        ),
    ],
};

export const Primary = () => <Buttons.Primary />;

export const Secondary = () => <Buttons.Secondary />;

export const SecondaryBrand = () => <Buttons.SecondaryBrand />;
SecondaryBrand.storyName = "Secondary brand";

export const White = () => <Buttons.White />;
White.storyName = "White (on dark)";

export const OutlinePill = () => <Buttons.OutlinePill />;
OutlinePill.storyName = "Outline pill";

export const Tertiary = () => <Buttons.Tertiary />;

export const LinkGray = () => <Buttons.LinkGray />;
LinkGray.storyName = "Link gray";

export const LinkColor = () => <Buttons.LinkColor />;
LinkColor.storyName = "Link color";

export const DestructivePrimary = () => <Buttons.PrimaryDestructive />;
DestructivePrimary.storyName = "Destructive primary";

export const DestructiveSecondary = () => <Buttons.SecondaryDestructive />;
DestructiveSecondary.storyName = "Destructive secondary";

export const DestructiveTertiary = () => <Buttons.TertiaryDestructive />;
DestructiveTertiary.storyName = "Destructive tertiary";

export const DestructiveLink = () => <Buttons.LinkDestructive />;
DestructiveLink.storyName = "Destructive link";

export const CloseX = () => <Buttons.CloseX />;

export const UtilityButton = () => <Buttons.UtilityButton />;
UtilityButton.storyName = "Utility button";

// Figma (BetterShot) references, screenshotted via `[data-compare]` and diffed against `figma/*.png`.
const Compare = ({ children, className = "bg-white" }: { children: ReactNode; className?: string }) => (
    <div data-compare className={`inline-flex flex-col items-start gap-4 self-start p-0 ${className}`}>
        {children}
    </div>
);

export const FigmaPrimary = () => (
    <Compare>
        <Button size="lg" className="w-[361px]">
            Review Shoot
        </Button>
    </Compare>
);

export const FigmaSecondary = () => (
    <Compare className="bg-white pt-px pr-0.75 pb-1 pl-0.5">
        <Button color="secondary-brand" size="xs">
            Edit Details
        </Button>
    </Compare>
);

export const FigmaOnDark = () => (
    <Compare className="bg-inverse">
        <Button color="white" size="md">
            Choose Background
        </Button>
        <Button color="white" size="md">
            Continue 1/5
        </Button>
    </Compare>
);

/** The splash CTA is 36px with 14px text: `sm` plus `py-2` (the board's only such button). */
export const FigmaSplashCta = () => (
    <Compare>
        <Button size="sm" className="py-2" iconTrailing={ArrowRight02SharpIcon}>
            Create my Headshot
        </Button>
    </Compare>
);

export const FigmaCloseButton = () => (
    <Compare className="bg-white px-px pb-0.5">
        <CloseButton theme="white" slot={null} />
    </Compare>
);

export const FigmaInfoPill = () => (
    <Compare>
        <Button color="outline-pill" iconTrailing={HelpCircleIcon}>
            What makes a good photo
        </Button>
    </Compare>
);
