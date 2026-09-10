import type { FC } from "react";
import * as DrawerDemos from "@/components/application/drawer/drawer.demo";

export default {
    title: "Application/Drawers",
    decorators: [
        (Story: FC) => (
            <div className="flex min-h-screen w-full items-center justify-center bg-secondary p-4">
                <Story />
            </div>
        ),
    ],
};

export const Placements = () => <DrawerDemos.PlacementsDrawerDemo />;

export const Sizes = () => <DrawerDemos.SizesDrawerDemo />;

export const FormDrawer = () => <DrawerDemos.FormDrawerDemo />;
FormDrawer.storyName = "Form drawer";
