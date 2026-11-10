import type { FC, ReactNode } from "react";
import { Badge } from "@/components/base/badges/badges";
import * as Badges from "@/components/base/badges/badges.demo";

export default {
    title: "Base components/Badges",
    decorators: [
        (Story: FC) => (
            <div className="flex h-screen w-full bg-primary p-4">
                <Story />
            </div>
        ),
    ],
};

export const PillColor = () => <Badges.PillColor />;
PillColor.storyName = "Pill color";

export const BadgeColor = () => <Badges.BadgeColor />;
BadgeColor.storyName = "Badge color";

export const BadgeModern = () => <Badges.BadgeModern />;
BadgeModern.storyName = "Badge modern";

export const WithDot = () => <Badges.WithDot />;
WithDot.storyName = "With dot";

export const WithDotBadgeColor = () => <Badges.WithDotBadgeColor />;
WithDotBadgeColor.storyName = "With dot badge color";

export const WithDotBadgeModern = () => <Badges.WithDotBadgeModern />;
WithDotBadgeModern.storyName = "With dot badge modern";

export const WithFlag = () => <Badges.WithFlag />;
WithFlag.storyName = "With flag";

export const WithFlagBadgeColor = () => <Badges.WithFlagBadgeColor />;
WithFlagBadgeColor.storyName = "With flag badge color";

export const WithFlagBadgeModern = () => <Badges.WithFlagBadgeModern />;
WithFlagBadgeModern.storyName = "With flag badge modern";

export const WithAvatar = () => <Badges.WithAvatar />;
WithAvatar.storyName = "With avatar";

export const WithAvatarBadgeColor = () => <Badges.WithAvatarBadgeColor />;
WithAvatarBadgeColor.storyName = "With avatar badge color";

export const WithAvatarBadgeModern = () => <Badges.WithAvatarBadgeModern />;
WithAvatarBadgeModern.storyName = "With avatar badge modern";

export const WithCloseX = () => <Badges.WithCloseX />;
WithCloseX.storyName = "With close X";

export const WithCloseXBadgeColor = () => <Badges.WithCloseXBadgeColor />;
WithCloseXBadgeColor.storyName = "With close X badge color";
export const WithCloseXBadgeModern = () => <Badges.WithCloseXBadgeModern />;

export const WithIconTrailing = () => <Badges.WithIconTrailing />;
WithIconTrailing.storyName = "With icon trailing";

export const WithIconTrailingBadgeColor = () => <Badges.WithIconTrailingBadgeColor />;
WithIconTrailingBadgeColor.storyName = "With icon trailing badge color";

export const WithIconTrailingBadgeModern = () => <Badges.WithIconTrailingBadgeModern />;
WithIconTrailingBadgeModern.storyName = "With icon trailing badge modern";

export const WithIconLeading = () => <Badges.WithIconLeading />;
WithIconLeading.storyName = "With icon leading";

export const WithIconLeadingBadgeColor = () => <Badges.WithIconLeadingBadgeColor />;
WithIconLeadingBadgeColor.storyName = "With icon leading badge color";

export const WithIconLeadingBadgeModern = () => <Badges.WithIconLeadingBadgeModern />;
WithIconLeadingBadgeModern.storyName = "With icon leading badge modern";

export const WithIconOnly = () => <Badges.WithIconOnly />;
WithIconOnly.storyName = "With icon only";

export const WithIconOnlyBadgeColor = () => <Badges.WithIconOnlyBadgeColor />;
WithIconOnlyBadgeColor.storyName = "With icon only badge color";

export const WithIconOnlyBadgeModern = () => <Badges.WithIconOnlyBadgeModern />;
WithIconOnlyBadgeModern.storyName = "With icon only badge modern";

export const TagRecipes = () => <Badges.TagRecipes />;
TagRecipes.storyName = "Tag recipes (BetterShot)";

export const StatusBadges = () => <Badges.StatusBadges />;
StatusBadges.storyName = "Status badges";

// Figma (BetterShot) references, screenshotted via `[data-compare]` and diffed against `figma/*.png` crops.
const Compare = ({ children, className = "bg-white" }: { children: ReactNode; className?: string }) => (
    <div data-compare className={`inline-flex flex-col items-start gap-4 self-start p-0 ${className}`}>
        {children}
    </div>
);

export const FigmaValueTag = () => (
    <Compare>
        <Badge type="color" color="brand" size="sm">
            Blue
        </Badge>
    </Compare>
);

export const FigmaStatusChips = () => (
    <Compare>
        <Badges.StatusBadges />
    </Compare>
);

export const FigmaShootTag = () => (
    <Compare>
        <Badge type="shoot">Shoot for graduation</Badge>
    </Compare>
);

export const FigmaOptionChip = () => (
    <Compare>
        <Badge type="option" size="sm">
            Style 4
        </Badge>
    </Compare>
);

export const FigmaOptionChipLarge = () => (
    <Compare>
        <Badge type="option" size="lg">
            Style 4
        </Badge>
    </Compare>
);

export const FigmaCountChip = () => (
    <Compare className="bg-[#F2F2F2]">
        <Badge type="count">32</Badge>
    </Compare>
);

export const FigmaGeneratingTags = () => (
    <Compare>
        <Badge type="generating" color="gray">
            Clothes
        </Badge>
        <Badge type="generating" color="purple">
            Background
        </Badge>
        <Badge type="generating" color="sky">
            Hairstyle
        </Badge>
    </Compare>
);

export const FigmaRecommended = () => (
    <Compare>
        <Badge type="recommended">Recommended</Badge>
    </Compare>
);
