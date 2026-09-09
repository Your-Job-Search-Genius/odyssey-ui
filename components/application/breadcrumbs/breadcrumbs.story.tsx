import type { FC } from "react";
import * as BreadcrumbsDemos from "@/components/application/breadcrumbs/breadcrumbs.demo";

export default {
    title: "Application/Breadcrumbs",
    decorators: [
        (Story: FC) => (
            <div className="flex min-h-screen w-full items-center justify-center bg-primary p-8">
                <Story />
            </div>
        ),
    ],
};

export const Basic = () => <BreadcrumbsDemos.BasicDemo />;

export const WithIcons = () => <BreadcrumbsDemos.WithIconsDemo />;
WithIcons.storyName = "With leading icons";

export const SingleItem = () => <BreadcrumbsDemos.SingleItemDemo />;
SingleItem.storyName = "Single item (current page only)";

export const Empty = () => <BreadcrumbsDemos.EmptyDemo />;
Empty.storyName = "Empty trail (renders nothing)";

export const Collapsed = () => <BreadcrumbsDemos.CollapsedDemo />;
Collapsed.storyName = "Collapsed overflow (maxItems)";

export const CollapsedWithMoreContext = () => <BreadcrumbsDemos.CollapsedWithMoreContextDemo />;
CollapsedWithMoreContext.storyName = "Collapsed, 2 before + 2 after";

export const TruncatedLabel = () => <BreadcrumbsDemos.TruncatedLabelDemo />;
TruncatedLabel.storyName = "Truncated labels with tooltip";

export const ManualComposition = () => <BreadcrumbsDemos.ManualCompositionDemo />;
ManualComposition.storyName = "Manual composition (static children)";

export const Rtl = () => <BreadcrumbsDemos.RtlDemo />;
Rtl.storyName = "RTL";

export const Sizes = () => <BreadcrumbsDemos.SizesDemo />;
