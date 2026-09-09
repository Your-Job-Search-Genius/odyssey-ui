"use client";

import { Bell01, Briefcase01, File01, Flash, Home03, Mail01 } from "@/components/foundations/icons";
import type { SidebarItemData } from "./sidebar";
import { Sidebar } from "./sidebar";

const itemsWithIcons: SidebarItemData[] = [
    { id: "home", label: "Home", icon: <Home03 />, href: "#home" },
    { id: "resume", label: "Resume", icon: <File01 />, href: "#resume" },
    {
        id: "interview-prep",
        label: "Interview prep",
        icon: <Briefcase01 />,
        children: [
            { id: "mock", label: "Mock interview", href: "#mock" },
            { id: "question-bank", label: "Question bank", href: "#question-bank" },
        ],
    },
    { id: "messages", label: "Messages", icon: <Mail01 />, href: "#messages" },
    { id: "notifications", label: "Notifications", icon: <Bell01 />, href: "#notifications" },
    { id: "upgrade", label: "Upgrade plan", icon: <Flash />, href: "#upgrade" },
];

const itemsWithoutIcons: SidebarItemData[] = itemsWithIcons.map(({ icon: _icon, ...item }) => item);

export const BasicSidebarDemo = () => <Sidebar aria-label="Primary" items={itemsWithIcons} activeId="resume" />;

export const NestedSidebarDemo = () => <Sidebar aria-label="Primary" items={itemsWithIcons} activeId="mock" />;

export const NoActiveItemSidebarDemo = () => <Sidebar aria-label="Primary" items={itemsWithIcons} />;

export const WithoutIconsSidebarDemo = () => <Sidebar aria-label="Primary" items={itemsWithoutIcons} activeId="resume" />;
