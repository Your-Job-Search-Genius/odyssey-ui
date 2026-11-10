import type { FC } from "react";
import { Button } from "@/components/base/buttons/button";
import { Select } from "@/components/base/select/select";
import * as Selects from "@/components/base/select/select.demo";
import { Clock04Icon } from "@/components/foundations/hugeicons";

export default {
    title: "Base components/Select",
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

export const Default = () => <Selects.Default />;
Default.decorators = [DefaultDecorator];

export const IconLeading = () => <Selects.IconLeading />;
IconLeading.decorators = [DefaultDecorator];
IconLeading.storyName = "Icon leading";

export const AvatarLeading = () => <Selects.AvatarLeading />;
AvatarLeading.decorators = [DefaultDecorator];
AvatarLeading.storyName = "Avatar leading";

export const DotLeading = () => <Selects.DotLeading />;
DotLeading.decorators = [DefaultDecorator];
DotLeading.storyName = "Dot leading";

export const Search = () => <Selects.Search />;
Search.decorators = [DefaultDecorator];

export const Tags = () => <Selects.Tags />;
Tags.decorators = [WiderDecorator];

export const MultiSelectSm = () => <Selects.MultiSelectSmDemo />;
MultiSelectSm.decorators = [DefaultDecorator];
MultiSelectSm.storyName = "Multi select (sm)";

export const MultiSelectMd = () => <Selects.MultiSelectMdDemo />;
MultiSelectMd.decorators = [DefaultDecorator];
MultiSelectMd.storyName = "Multi select (md)";

export const MultiSelectWithIcon = () => <Selects.MultiSelectWithIconDemo />;
MultiSelectWithIcon.decorators = [DefaultDecorator];
MultiSelectWithIcon.storyName = "Multi select with icon";

export const MultiSelectLg = () => <Selects.MultiSelectLgDemo />;
MultiSelectLg.decorators = [DefaultDecorator];
MultiSelectLg.storyName = "Multi select (lg)";

export const MultiSelectDisabled = () => <Selects.MultiSelectDisabledDemo />;
MultiSelectDisabled.decorators = [DefaultDecorator];
MultiSelectDisabled.storyName = "Multi select (disabled)";

const versions = [
    { id: "aug24", label: "Aug 24, Sat" },
    { id: "aug20", label: "Aug 20, Wed" },
];

/** BetterShot P32 version select (`variant="button"`) next to the New Shoot button. */
export const FigmaVersionSelect = () => (
    <div data-compare className="inline-flex flex-col items-start gap-4 bg-white p-0">
        <div className="flex items-center gap-2">
            <Select aria-label="Shoot version" variant="button" icon={Clock04Icon} defaultSelectedKey="aug24" items={versions}>
                {(item) => <Select.Item id={item.id}>{item.label}</Select.Item>}
            </Select>
            <Button color="primary" size="sm">
                New Shoot 2/3
            </Button>
        </div>
    </div>
);

/** The field look at each size, with placeholder, invalid and disabled states (not drawn in Figma). */
export const FigmaStates = () => (
    <div data-compare className="inline-flex w-80 flex-col items-start gap-4 bg-white p-0">
        {(["sm", "md", "lg"] as const).map((size) => (
            <Select key={size} label={`Size ${size}`} size={size} defaultSelectedKey="aug24" items={versions} className="w-full">
                {(item) => <Select.Item id={item.id}>{item.label}</Select.Item>}
            </Select>
        ))}
        <Select label="Placeholder" placeholder="Select a date" hint="This is a helper text" items={versions} className="w-full">
            {(item) => <Select.Item id={item.id}>{item.label}</Select.Item>}
        </Select>
        <Select label="Invalid" isInvalid hint="Pick a date." items={versions} className="w-full">
            {(item) => <Select.Item id={item.id}>{item.label}</Select.Item>}
        </Select>
        <Select label="Disabled" isDisabled defaultSelectedKey="aug24" items={versions} className="w-full">
            {(item) => <Select.Item id={item.id}>{item.label}</Select.Item>}
        </Select>
    </div>
);
