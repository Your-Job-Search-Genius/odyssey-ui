import { withOverlayAware } from "@/components/internal/decorators";
import * as Demos from "./sidebar-navigation.demo";

export default {
    title: "Application/Sidebar",
    decorators: [
        withOverlayAware((Story) => (
            <div className="min-h-screen w-full bg-primary">
                <Story />
            </div>
        )),
    ],
};

export const SidebarNavigationSimpleDemo = () => <Demos.SidebarNavigationSimpleDemo />;
SidebarNavigationSimpleDemo.storyName = "Sidebar navigation simple";
SidebarNavigationSimpleDemo.parameters = {
    design: {
        desktop: "1161-8593",
    },
};

export const SidebarNavigationDualTierDemo = () => <Demos.SidebarNavigationDualTierDemo />;
SidebarNavigationDualTierDemo.storyName = "Sidebar navigation dual-tier";
SidebarNavigationDualTierDemo.parameters = {
    design: {
        desktop: "1161-17322",
    },
};

export const SidebarNavigationSlimDemo = () => <Demos.SidebarNavigationSlimDemo />;
SidebarNavigationSlimDemo.storyName = "Sidebar navigation slim";
SidebarNavigationSlimDemo.parameters = {
    design: {
        desktop: "1165-2013",
    },
};

export const SidebarSectionDividersDemo = () => <Demos.SidebarSectionDividersDemo />;
SidebarSectionDividersDemo.storyName = "Sidebar sections dividers";
SidebarSectionDividersDemo.parameters = {
    design: {
        desktop: "7893-127251",
    },
};

export const SidebarNavigationSectionsSubheadingsDemo = () => <Demos.SidebarNavigationSectionsSubheadingsDemo />;
SidebarNavigationSectionsSubheadingsDemo.storyName = "Sidebar navigation sections subheadings";
SidebarNavigationSectionsSubheadingsDemo.parameters = {
    design: {
        desktop: "7901-412479",
    },
};

export const SidebarNavigationSimpleMinimalDemo = () => <Demos.SidebarNavigationSimpleMinimalDemo />;
SidebarNavigationSimpleMinimalDemo.storyName = "Sidebar navigation simple — minimal";

export const SidebarNavigationSimpleMinimalNestedDemo = () => <Demos.SidebarNavigationSimpleMinimalNestedDemo />;
SidebarNavigationSimpleMinimalNestedDemo.storyName = "Sidebar navigation simple — minimal, expanded submenu";

export const SidebarNavigationSimpleMinimalNoActiveDemo = () => <Demos.SidebarNavigationSimpleMinimalNoActiveDemo />;
SidebarNavigationSimpleMinimalNoActiveDemo.storyName = "Sidebar navigation simple — minimal, no active item";

export const SidebarNavigationSimpleMinimalWithoutIconsDemo = () => <Demos.SidebarNavigationSimpleMinimalWithoutIconsDemo />;
SidebarNavigationSimpleMinimalWithoutIconsDemo.storyName = "Sidebar navigation simple — minimal, without icons";
