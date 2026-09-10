import type { FC } from "react";
import * as SidebarDemos from "@/components/application/sidebar/sidebar.demo";

export default {
    title: "Application/Sidebar",
    decorators: [
        (Story: FC) => (
            <div className="flex min-h-screen w-full items-start justify-center bg-primary p-4">
                <Story />
            </div>
        ),
    ],
};

export const Basic = () => <SidebarDemos.BasicSidebarDemo />;

export const Nested = () => <SidebarDemos.NestedSidebarDemo />;
Nested.storyName = "With expanded submenu";

export const NoActiveItem = () => <SidebarDemos.NoActiveItemSidebarDemo />;

export const WithoutIcons = () => <SidebarDemos.WithoutIconsSidebarDemo />;
