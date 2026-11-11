import { RouterProvider } from "react-aria-components";
import { SidebarLayout, type SidebarNavItem } from "@/components/application/sidebar/sidebar";
import {
    Briefcase05Icon,
    CoPresentIcon,
    Contact01Icon,
    File01Icon,
    HelpCircleIcon,
    Home01Icon,
    Invoice03Icon,
    Notification02Icon,
    ScrollIcon,
    UserIdVerificationIcon,
} from "@/components/foundations/hugeicons";
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

const figmaItems: SidebarNavItem[] = [
    { label: "Dashboard", href: "/dashboard", icon: Home01Icon },
    { label: "Job", icon: Briefcase05Icon, items: [{ label: "Feed", href: "/job-board" }] },
    { label: "Resume", href: "/resumes", icon: File01Icon },
    { label: "Interview", icon: CoPresentIcon, items: [{ label: "Mock Interview", href: "/interview-prep" }] },
    { label: "Cover Letter", href: "/documents", icon: ScrollIcon },
    { label: "My Contacts", href: "/contact", icon: Contact01Icon },
    { label: "Offer Negotiation", href: "/offer-negotiation", icon: Invoice03Icon },
    { label: "Headshot", href: "/headshot", icon: UserIdVerificationIcon },
];

/** Tenant-coloured tiles, passed through the `brand.logo` / `account.avatar` slots. */
const TenantTile = ({ children, className }: { children: string; className?: string }) => (
    <span className={`flex size-full items-center justify-center bg-[#022AFD] font-medium ${className ?? ""}`}>{children}</span>
);

/** The Figma "Sidebar" master (17080:31253) inside a 1440x824 frame. Screenshot `aside > div` for the card alone. */
export const Figma = () => (
    <div data-compare className="h-[824px] w-[1440px] overflow-hidden bg-white">
        <RouterProvider navigate={() => {}}>
            <SidebarLayout
                className="h-full"
                brand={{ name: "Institution Name", logo: <TenantTile className="text-[15px] text-white">M</TenantTile> }}
                items={figmaItems}
                activeUrl="/headshot"
                language={{
                    value: "en",
                    onChange: () => {},
                    options: [{ id: "en", label: "English", flag: "https://www.untitledui.com/images/flags/US.svg" }],
                }}
                footerItems={[
                    { label: "Notifications", icon: Notification02Icon, href: "#" },
                    { label: "Help and Shortcuts", icon: HelpCircleIcon, href: "#" },
                ]}
                account={{ name: "Moremi Chris", avatar: <TenantTile className="text-sm text-[#55B1F3]">MC</TenantTile> }}
            />
        </RouterProvider>
    </div>
);
