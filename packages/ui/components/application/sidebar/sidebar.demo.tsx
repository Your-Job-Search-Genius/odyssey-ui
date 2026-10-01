"use client";

import { useState } from "react";
import { RouterProvider } from "react-aria-components";
import { SidebarLayout, type SidebarLayoutProps, type SidebarNavItem } from "@/components/application/sidebar/sidebar";
import { Table } from "@/components/application/table/table";
import { BadgeWithIcon } from "@/components/base/badges/badges";
import { Button } from "@/components/base/buttons/button";
import { Dropdown } from "@/components/base/dropdown/dropdown";
import {
    ArrowRight,
    ArrowUpRight,
    BookOpen01,
    Bookmark,
    Briefcase01,
    CheckCircle,
    CurrencyDollarCircle,
    Eye,
    File02,
    File06,
    HelpCircle,
    Home02,
    Keyboard01,
    LogOut01,
    Mail01,
    MessageChatSquare,
    User01,
    Users01,
} from "@/components/foundations/icons";

const navItems: SidebarNavItem[] = [
    { label: "Dashboard", href: "/dashboard", icon: Home02 },
    { label: "Resume", href: "/resumes", icon: File06 },
    {
        label: "Jobs",
        icon: Briefcase01,
        items: [
            { label: "Feed", href: "/job-board" },
            { label: "Tracker", href: "/job-board?activeTab=tracker" },
        ],
    },
    {
        label: "Interview",
        icon: MessageChatSquare,
        items: [
            { label: "Mock Interview", href: "/interview-prep/mock-interview" },
            { label: "Job Preparation", href: "/interview-prep/job-preparation" },
            { label: "Question Bank", href: "/interview-prep/question-bank" },
        ],
    },
    { label: "Cover Letter", href: "/documents", icon: File02 },
    { label: "Contacts", href: "/contact", icon: Users01 },
    { label: "Offer Negotiation", href: "/offer-negotiation", icon: CurrencyDollarCircle },
];

const flag = (code: string) => `https://www.untitledui.com/images/flags/${code}.svg`;

/** Shared shell props; demos keep navigation in local state via RouterProvider so links don't leave the page. */
const useShellProps = (initialUrl = "/dashboard") => {
    const [activeUrl, setActiveUrl] = useState(initialUrl);
    const [language, setLanguage] = useState("en");
    const [theme, setTheme] = useState<"light" | "dark" | "system">("system");
    const themeItem = (id: typeof theme, label: string) => ({
        id: `theme-${id}`,
        label,
        section: "Theme",
        isSelected: theme === id,
        onAction: () => setTheme(id),
    });

    const props: SidebarLayoutProps = {
        brand: { name: "Writesea" },
        items: navItems,
        activeUrl,
        language: {
            value: language,
            onChange: setLanguage,
            options: [
                { id: "en", label: "English", flag: flag("US") },
                { id: "es", label: "Español", flag: flag("ES") },
                { id: "fr", label: "Français", flag: flag("FR") },
            ],
        },
        footerItems: [
            {
                label: "Help and Shortcuts",
                icon: HelpCircle,
                menu: [
                    { id: "help", label: "Help", icon: BookOpen01 },
                    { id: "shortcuts", label: "Accessibility Shortcuts", icon: Keyboard01 },
                ],
            },
        ],
        account: {
            name: "Olivia Rhye",
            email: "olivia@writesea.com",
            menuItems: [
                { id: "settings", label: "Account Settings", icon: User01 },
                // A single-choice section: announced as menuitemradio, the current one shows a check.
                themeItem("light", "Light"),
                themeItem("dark", "Dark"),
                themeItem("system", "System"),
                { id: "logout", label: "Log out", icon: LogOut01 },
            ],
        },
        className: "h-dvh max-h-full",
    };

    return { props, navigate: setActiveUrl };
};

const stats = [
    { label: "Total Number of Resumes Added", value: 6, link: "Go to Resumes", href: "/resumes", icon: File06 },
    { label: "Total Number of Jobs", value: 8, link: "Go to Jobs", href: "/job-board", icon: Briefcase01 },
    { label: "Total Number of Cover Letters", value: 32, link: "Go to Cover Letters", href: "/documents", icon: Mail01 },
];

const jobs = [
    {
        id: "1",
        company: "N/A",
        url: "https://job-boards.greenhouse.io/data-annotator",
        title: "Data Annotator",
        status: "Interviewing",
        date: "August 20, 2026",
    },
    { id: "2", company: "N/A", url: "https://apply.workable.com/j/25D8A", title: "Design Quality Officer", status: "Applied", date: "August 17, 2026" },
    {
        id: "3",
        company: "Eastern Federal Union Limited",
        url: "https://pk.indeed.com/l-lahore-jobs",
        title: "Required Team for data entry",
        status: "Bookmarked",
        date: "June 09, 2026",
    },
    { id: "4", company: "Techsea", url: "https://google.com", title: "Product Designer", status: "Bookmarked", date: "April 01, 2026" },
    {
        id: "5",
        company: "HMG Careers",
        url: "https://www.resume-library.com/job",
        title: "Transportation Project Manager",
        status: "Bookmarked",
        date: "March 03, 2025",
    },
] as const;

const statusBadges = {
    Interviewing: { color: "warning", icon: User01 },
    Applied: { color: "brand", icon: CheckCircle },
    Bookmarked: { color: "indigo", icon: Bookmark },
} as const;

/** The dashboard page from the Writesea client app, used as realistic page content inside the shell. */
const DashboardPage = () => (
    <div className="flex flex-col gap-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex flex-col gap-2">
                <h1 className="text-display-xs font-semibold text-primary">Hello Olivia</h1>
                <p className="text-md text-secondary">Welcome! Let&apos;s help you land your dream role! 🎉</p>
            </div>
            <div className="flex flex-wrap gap-4">
                <Button color="secondary" size="md">
                    Add Resume
                </Button>
                <Button color="secondary" size="md">
                    Practice Mock Interview
                </Button>
            </div>
        </div>

        {/* Container-query breakpoints: the grid responds to the width the sidebar leaves, not the viewport. */}
        <div className="grid grid-cols-1 gap-6 @3xl:grid-cols-3">
            {stats.map((stat) => (
                <div key={stat.label} className="flex min-w-0 flex-col gap-4 rounded-2xl border border-secondary p-6">
                    <span className="flex size-12 items-center justify-center rounded-lg border border-secondary shadow-xs">
                        <stat.icon aria-hidden="true" className="size-6 text-fg-quaternary" />
                    </span>
                    <p className="text-sm font-medium text-secondary">{stat.label}</p>
                    <div className="flex flex-wrap items-end justify-between gap-x-4 gap-y-2">
                        <p className="text-display-sm font-semibold text-primary">{stat.value}</p>
                        <Button href={stat.href} color="link-color" size="sm" iconTrailing={ArrowUpRight}>
                            {stat.link}
                        </Button>
                    </div>
                </div>
            ))}
        </div>

        <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between gap-4">
                <h2 className="text-lg font-semibold text-primary">Job Tracker</h2>
                <Button href="/job-board?activeTab=tracker" color="link-color" size="md" iconTrailing={ArrowRight}>
                    View Tracker
                </Button>
            </div>
            <Table aria-label="Job tracker">
                <Table.Header>
                    <Table.Head id="company" label="Company" isRowHeader className="w-1/4" />
                    <Table.Head id="title" label="Job title" />
                    <Table.Head id="status" label="Application status" />
                    <Table.Head id="date" label="Date added" />
                    <Table.Head id="action" label="Action" />
                </Table.Header>
                <Table.Body items={jobs}>
                    {(job) => (
                        <Table.Row id={job.id}>
                            <Table.Cell>
                                <p className="text-sm font-medium text-primary">{job.company}</p>
                                <p className="max-w-52 truncate text-xs text-tertiary">{job.url}</p>
                            </Table.Cell>
                            <Table.Cell className="max-w-52 truncate">{job.title}</Table.Cell>
                            <Table.Cell>
                                <BadgeWithIcon type="color" size="md" color={statusBadges[job.status].color} iconLeading={statusBadges[job.status].icon}>
                                    {job.status}
                                </BadgeWithIcon>
                            </Table.Cell>
                            <Table.Cell className="whitespace-nowrap">{job.date}</Table.Cell>
                            <Table.Cell>
                                <div className="flex items-center gap-3">
                                    <Button color="secondary" size="sm" iconLeading={Eye} className="whitespace-nowrap">
                                        View Job Description
                                    </Button>
                                    <Dropdown.Root>
                                        <Dropdown.DotsButton />
                                        <Dropdown.Popover>
                                            <Dropdown.Menu>
                                                <Dropdown.Item label="Edit" />
                                                <Dropdown.Item label="Delete" />
                                            </Dropdown.Menu>
                                        </Dropdown.Popover>
                                    </Dropdown.Root>
                                </div>
                            </Table.Cell>
                        </Table.Row>
                    )}
                </Table.Body>
            </Table>
        </div>
    </div>
);

export const SidebarLayoutDemo = () => {
    const { props, navigate } = useShellProps();

    return (
        <RouterProvider navigate={navigate}>
            <SidebarLayout {...props}>
                <DashboardPage />
            </SidebarLayout>
        </RouterProvider>
    );
};

export const SidebarLayoutCollapsedDemo = () => {
    const { props, navigate } = useShellProps("/job-board?activeTab=tracker");

    return (
        <RouterProvider navigate={navigate}>
            <SidebarLayout {...props} defaultCollapsed>
                <DashboardPage />
            </SidebarLayout>
        </RouterProvider>
    );
};

export const SidebarLayoutMinimalDemo = () => {
    const [activeUrl, setActiveUrl] = useState("/dashboard");

    return (
        <RouterProvider navigate={setActiveUrl}>
            <SidebarLayout brand={{ name: "Writesea" }} items={navItems.slice(0, 4)} activeUrl={activeUrl} className="h-dvh max-h-full">
                <h1 className="text-display-xs font-semibold text-primary">Page title</h1>
            </SidebarLayout>
        </RouterProvider>
    );
};
