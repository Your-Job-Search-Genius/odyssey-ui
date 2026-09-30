import { withOverlayAware } from "@/components/internal/decorators";
import * as Demos from "./sidebar.demo";

export default {
    title: "Application/Sidebar",
    decorators: [
        withOverlayAware((Story) => (
            <div className="h-screen w-full bg-primary">
                <Story />
            </div>
        )),
    ],
};

export const SidebarLayoutDemo = () => <Demos.SidebarLayoutDemo />;
SidebarLayoutDemo.storyName = "Sidebar layout";

export const SidebarLayoutCollapsedDemo = () => <Demos.SidebarLayoutCollapsedDemo />;
SidebarLayoutCollapsedDemo.storyName = "Sidebar layout collapsed";

export const SidebarLayoutMobileDemo = () => <Demos.SidebarLayoutDemo />;
SidebarLayoutMobileDemo.storyName = "Sidebar layout mobile";
SidebarLayoutMobileDemo.globals = { viewport: { value: "mobile" } };

export const SidebarLayoutMinimalDemo = () => <Demos.SidebarLayoutMinimalDemo />;
SidebarLayoutMinimalDemo.storyName = "Sidebar layout minimal";
