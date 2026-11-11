import type { FC } from "react";
import { Tabs } from "@/components/application/tabs/tabs";
import { HijabIcon, UserAccountIcon } from "@/components/foundations/hugeicons";
import * as Demos from "./tabs.demo";

export default {
    title: "Application/Tabs",
    decorators: [
        (Story: FC) => (
            <div className="flex min-h-screen items-center justify-center bg-primary p-8">
                <Story />
            </div>
        ),
    ],
};

export const ButtonBrandHorizontal = () => <Demos.ButtonBrandHorizontal />;
ButtonBrandHorizontal.storyName = "Button brand horizontal";

export const ButtonBrandHorizontalFullWidth = () => <Demos.ButtonBrandHorizontalFullWidth />;
ButtonBrandHorizontalFullWidth.storyName = "Button brand horizontal full width";

export const ButtonBrandVertical = () => <Demos.ButtonBrandVertical />;
ButtonBrandVertical.storyName = "Button brand vertical";

export const ButtonGrayHorizontal = () => <Demos.ButtonGrayHorizontal />;
ButtonGrayHorizontal.storyName = "Button gray horizontal";

export const ButtonGrayHorizontalFullWidth = () => <Demos.ButtonGrayHorizontalFullWidth />;
ButtonGrayHorizontalFullWidth.storyName = "Button gray horizontal full width";

export const ButtonGrayVertical = () => <Demos.ButtonGrayVertical />;
ButtonGrayVertical.storyName = "Button gray vertical";

export const UnderlineHorizontal = () => <Demos.UnderlineHorizontal />;
UnderlineHorizontal.storyName = "Underline horizontal";

export const UnderlineHorizontalFullWidth = () => <Demos.UnderlineHorizontalFullWidth />;
UnderlineHorizontalFullWidth.storyName = "Underline horizontal full width";

export const UnderlineVertical = () => <Demos.UnderlineVertical />;
UnderlineVertical.storyName = "Underline vertical";

export const ButtonBorderHorizontal = () => <Demos.ButtonBorderHorizontal />;
ButtonBorderHorizontal.storyName = "Button border horizontal";

export const ButtonBorderHorizontalFullWidth = () => <Demos.ButtonBorderHorizontalFullWidth />;
ButtonBorderHorizontalFullWidth.storyName = "Button border horizontal full width";

export const ButtonBorderVertical = () => <Demos.ButtonBorderVertical />;
ButtonBorderVertical.storyName = "Button border vertical";

export const ButtonMinimalHorizontal = () => <Demos.ButtonMinimalHorizontal />;
ButtonMinimalHorizontal.storyName = "Button minimal horizontal";

export const ButtonMinimalHorizontalFullWidth = () => <Demos.ButtonMinimalHorizontalFullWidth />;
ButtonMinimalHorizontalFullWidth.storyName = "Button minimal horizontal full width";

export const ButtonMinimalVertical = () => <Demos.ButtonMinimalVertical />;
ButtonMinimalVertical.storyName = "Button minimal vertical";

const categories = ["All", "Suits", "Casual", "Creative", "Medical", "Therapy", "Graduation", "Culinary", "Fitness"].map((label) => ({ id: label, label }));

/** P23 category tabs (14695:4335): underline tabs spread across a 770px bar. */
export const FigmaCategoryTabs = () => (
    <div data-compare className="inline-flex flex-col items-start gap-4 bg-white p-0">
        <Tabs defaultSelectedKey="All" className="w-[770px]">
            <Tabs.List type="underline" items={categories} className="justify-between" />
        </Tabs>
    </div>
);

/** P21 anchor side-nav (14853:207258): vertical `line` tabs with 28px icons. */
export const FigmaAnchorNav = () => (
    <div data-compare className="inline-flex flex-col items-start gap-4 bg-white p-0">
        <Tabs orientation="vertical" defaultSelectedKey="face">
            <Tabs.List
                type="line"
                aria-label="Persona sections"
                items={[
                    { id: "basic", label: "Basic Details", icon: UserAccountIcon },
                    { id: "face", label: "Facial Features", icon: HijabIcon },
                ]}
            />
        </Tabs>
    </div>
);
