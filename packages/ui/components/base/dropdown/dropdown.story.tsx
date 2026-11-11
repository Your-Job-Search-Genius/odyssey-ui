"use client";

// The docs preview this file's exports (dropdown has no *.demo.tsx), and their static export renders a story file
// on the server unless it is a client module: the Figma stories' compound Dropdown.* parts and icon props need this.
import type { FC } from "react";
import { Button } from "@/components/base/buttons/button";
import { Dropdown } from "@/components/base/dropdown/dropdown";
import { DropdownAccountBreadcrumb } from "@/components/base/dropdown/dropdown-account-breadcrumb";
import { DropdownAccountButton } from "@/components/base/dropdown/dropdown-account-button";
import { DropdownAccountCardMD } from "@/components/base/dropdown/dropdown-account-card-md";
import { DropdownAccountCardSM } from "@/components/base/dropdown/dropdown-account-card-sm";
import { DropdownAccountCardXS } from "@/components/base/dropdown/dropdown-account-card-xs";
import { DropdownAvatar } from "@/components/base/dropdown/dropdown-avatar";
import { DropdownButtonAdvanced } from "@/components/base/dropdown/dropdown-button-advanced";
import { DropdownButtonLink } from "@/components/base/dropdown/dropdown-button-link";
import { DropdownButtonSimple } from "@/components/base/dropdown/dropdown-button-simple";
import { DropdownContextMenuAdvanced } from "@/components/base/dropdown/dropdown-context-menu-advanced";
import { DropdownContextMenuSimple } from "@/components/base/dropdown/dropdown-context-menu-simple";
import { DropdownIconAdvanced } from "@/components/base/dropdown/dropdown-icon-advanced";
import { DropdownIconSimple } from "@/components/base/dropdown/dropdown-icon-simple";
import { DropdownIntegration } from "@/components/base/dropdown/dropdown-integration";
import { DropdownSearchAdvanced } from "@/components/base/dropdown/dropdown-search-advanced";
import { DropdownSearchSimple } from "@/components/base/dropdown/dropdown-search-simple";
import { ArrowDown01SharpIcon } from "@/components/foundations/hugeicons";

export default {
    title: "Base components/Dropdown menus",
    decorators: [
        (Story: FC) => (
            <div className="flex min-h-screen w-full items-start justify-center bg-primary p-8">
                <Story />
            </div>
        ),
    ],
};

export const DropdownButtonSimpleStory = () => <DropdownButtonSimple />;
DropdownButtonSimpleStory.storyName = "Dropdown menu button simple";

export const DropdownButtonAdvancedStory = () => <DropdownButtonAdvanced />;
DropdownButtonAdvancedStory.storyName = "Dropdown menu button advanced";

export const DropdownButtonLinkStory = () => <DropdownButtonLink />;
DropdownButtonLinkStory.storyName = "Dropdown menu button link";

export const DropdownContextMenuSimpleStory = () => <DropdownContextMenuSimple />;
DropdownContextMenuSimpleStory.storyName = "Dropdown menu context menu simple";

export const DropdownContextMenuAdvancedStory = () => <DropdownContextMenuAdvanced />;
DropdownContextMenuAdvancedStory.storyName = "Dropdown menu context menu advanced";

export const DropdownIconSimpleStory = () => <DropdownIconSimple />;
DropdownIconSimpleStory.storyName = "Dropdown menu icon simple";

export const DropdownIconAdvancedStory = () => <DropdownIconAdvanced />;
DropdownIconAdvancedStory.storyName = "Dropdown menu icon advanced";

export const DropdownSearchSimpleStory = () => <DropdownSearchSimple />;
DropdownSearchSimpleStory.storyName = "Dropdown menu search simple";

export const DropdownSearchAdvancedStory = () => <DropdownSearchAdvanced />;
DropdownSearchAdvancedStory.storyName = "Dropdown menu search advanced";

export const DropdownIntegrationStory = () => <DropdownIntegration />;
DropdownIntegrationStory.storyName = "Dropdown menu integration";

export const DropdownAccountButtonStory = () => <DropdownAccountButton />;
DropdownAccountButtonStory.storyName = "Dropdown menu account button";

export const DropdownAvatarStory = () => <DropdownAvatar />;
DropdownAvatarStory.storyName = "Dropdown menu avatar";

export const DropdownAccountCardXSStory = () => <DropdownAccountCardXS />;
DropdownAccountCardXSStory.storyName = "Dropdown menu account card xs";

export const DropdownAccountCardSMStory = () => <DropdownAccountCardSM />;
DropdownAccountCardSMStory.storyName = "Dropdown menu account card sm";

export const DropdownAccountCardMDStory = () => <DropdownAccountCardMD />;
DropdownAccountCardMDStory.storyName = "Dropdown menu account card md";

export const DropdownAccountBreadcrumbStory = () => <DropdownAccountBreadcrumb />;
DropdownAccountBreadcrumbStory.storyName = "Dropdown menu account breadcrumb";

/** P32 Download menu (14721:107834): counts in chips, rows split by a line. Screenshot `[role=menu]` for the menu alone. */
export const Figma = () => (
    <div data-compare className="inline-flex flex-col items-start gap-4 bg-white p-0">
        <Dropdown.Root defaultOpen>
            <Button color="secondary" size="sm" iconTrailing={ArrowDown01SharpIcon}>
                Download
            </Button>
            <Dropdown.Popover placement="bottom start" className="w-auto">
                <Dropdown.Menu aria-label="Download">
                    <Dropdown.Item id="all" label="All" count={32} />
                    <Dropdown.Separator />
                    <Dropdown.Item id="favorites" label="Favorites" count={8} />
                </Dropdown.Menu>
            </Dropdown.Popover>
        </Dropdown.Root>
    </div>
);

/** Phone (Figma 14866:262194): `mobileSheet={false}` keeps the menu anchored under its button instead of a bottom sheet. Shoot at 402px. */
export const FigmaPhoneAnchored = () => (
    <div data-compare className="flex w-full justify-end bg-white p-0 pr-[73px]">
        <Dropdown.Root defaultOpen>
            <Button color="secondary" size="sm" className="px-1.5">
                Download
            </Button>
            <Dropdown.Popover mobileSheet={false} placement="bottom right" offset={5} className="w-[116px]">
                <Dropdown.Menu aria-label="Download">
                    <Dropdown.Item id="all" label="All" count={32} />
                    <Dropdown.Separator />
                    <Dropdown.Item id="favorites" label="Favorites" count={8} />
                </Dropdown.Menu>
            </Dropdown.Popover>
        </Dropdown.Root>
    </div>
);
