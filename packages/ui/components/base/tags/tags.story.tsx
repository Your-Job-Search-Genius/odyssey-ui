import type { FC } from "react";
import { Tag, TagGroup, TagList } from "@/components/base/tags/tags";
import * as Tags from "@/components/base/tags/tags.demo";

export default {
    title: "Base components/Tags",
    decorators: [
        (Story: FC) => (
            <div className="flex min-h-screen w-full overflow-auto bg-primary p-4">
                <Story />
            </div>
        ),
    ],
};

export const Default = () => <Tags.Default />;

export const CloseX = () => <Tags.CloseX />;

export const Count = () => <Tags.Count />;

export const CheckboxDefault = () => <Tags.CheckboxDefault />;
CheckboxDefault.storyName = "Checkbox default";

export const CheckboxCloseX = () => <Tags.CheckboxCloseX />;
CheckboxCloseX.storyName = "Checkbox close X";

export const CheckboxCount = () => <Tags.CheckboxCount />;
CheckboxCount.storyName = "Checkbox count";

/** Figma (BetterShot) count chip (#E9EAEB, r5, 19px, Medium 13) inside the `md` tag; the chip is what's compared. */
export const FigmaCount = () => (
    <div data-compare className="inline-flex flex-col items-start gap-4 self-start bg-white p-0">
        <TagGroup label="Downloads" size="md">
            <TagList className="flex gap-2">
                <Tag count={32}>All</Tag>
                <Tag count={8}>Favorites</Tag>
            </TagList>
        </TagGroup>
    </div>
);
