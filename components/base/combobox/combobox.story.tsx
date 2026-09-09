import type { FC } from "react";
import * as ComboBoxes from "@/components/base/combobox/combobox.demo";

export default {
    title: "Base components/ComboBox",
};

const DefaultDecorator = (Story: FC) => (
    <div className="flex min-h-screen w-full bg-primary p-4">
        <div className="w-80">
            <Story />
        </div>
    </div>
);

const WiderDecorator = (Story: FC) => (
    <div className="flex min-h-screen w-full bg-primary p-4">
        <div className="w-100">
            <Story />
        </div>
    </div>
);

export const Default = () => <ComboBoxes.DefaultDemo />;
Default.decorators = [DefaultDecorator];

export const AvatarLeading = () => <ComboBoxes.AvatarLeadingDemo />;
AvatarLeading.decorators = [DefaultDecorator];
AvatarLeading.storyName = "Avatar leading";

export const IconLeading = () => <ComboBoxes.IconLeadingDemo />;
IconLeading.decorators = [DefaultDecorator];
IconLeading.storyName = "Icon leading";

export const DescriptionAndBadge = () => <ComboBoxes.DescriptionAndBadgeDemo />;
DescriptionAndBadge.decorators = [WiderDecorator];
DescriptionAndBadge.storyName = "Description & badge";

export const Grouped = () => <ComboBoxes.GroupedDemo />;
Grouped.decorators = [DefaultDecorator];
Grouped.storyName = "Grouped (sections)";

export const WithFooterAction = () => <ComboBoxes.WithFooterActionDemo />;
WithFooterAction.decorators = [DefaultDecorator];
WithFooterAction.storyName = "With footer action";

export const EmptyState = () => <ComboBoxes.EmptyStateDemo />;
EmptyState.decorators = [DefaultDecorator];
EmptyState.storyName = "Empty state";

export const Disabled = () => <ComboBoxes.DisabledDemo />;
Disabled.decorators = [DefaultDecorator];

export const Invalid = () => <ComboBoxes.InvalidDemo />;
Invalid.decorators = [DefaultDecorator];

export const Sizes = () => <ComboBoxes.SizesDemo />;
Sizes.decorators = [DefaultDecorator];

export const AsyncServerSync = () => <ComboBoxes.AsyncServerSyncDemo />;
AsyncServerSync.decorators = [DefaultDecorator];
AsyncServerSync.storyName = "Async (server-synced)";

export const AsyncServerSyncDebounced = () => <ComboBoxes.AsyncServerSyncDebouncedDemo />;
AsyncServerSyncDebounced.decorators = [DefaultDecorator];
AsyncServerSyncDebounced.storyName = "Async (debounced server sync)";
