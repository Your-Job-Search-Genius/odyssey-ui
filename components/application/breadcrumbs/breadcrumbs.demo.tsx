"use client";

import { Breadcrumbs } from "@/components/application/breadcrumbs/breadcrumbs";
import { Folder, Home01, Settings01 } from "@/components/foundations/icons";

const basicItems = [
    { id: "home", label: "Home", href: "/" },
    { id: "projects", label: "Projects", href: "/projects" },
    { id: "current", label: "Writesea Odyssey" },
];

export const BasicDemo = () => <Breadcrumbs items={basicItems} />;

export const WithIconsDemo = () => (
    <Breadcrumbs
        items={[
            { id: "home", label: "Home", href: "/", icon: Home01 },
            { id: "settings", label: "Settings", href: "/settings", icon: Settings01 },
            { id: "current", label: "Billing" },
        ]}
    />
);

export const SingleItemDemo = () => <Breadcrumbs items={[{ id: "current", label: "Dashboard" }]} />;

export const EmptyDemo = () => (
    <div className="flex flex-col gap-2">
        <p className="text-sm text-tertiary">The trail below is passed zero items — the component renders nothing rather than an empty bar:</p>
        <div className="rounded-md border border-dashed border-secondary p-3">
            <Breadcrumbs items={[]} />
            <p className="text-xs text-quaternary">(nothing renders here)</p>
        </div>
    </div>
);

const deepItems = [
    { id: "home", label: "Home", href: "/", icon: Home01 },
    { id: "acme", label: "Acme Corp", href: "/acme" },
    { id: "engineering", label: "Engineering", href: "/acme/engineering" },
    { id: "platform", label: "Platform team", href: "/acme/engineering/platform" },
    { id: "design-system", label: "Design system", href: "/acme/engineering/platform/design-system" },
    { id: "components", label: "Components", href: "/acme/engineering/platform/design-system/components" },
    { id: "application", label: "Application", href: "/acme/engineering/platform/design-system/components/application" },
    { id: "breadcrumbs", label: "Breadcrumbs" },
];

export const CollapsedDemo = () => <Breadcrumbs items={deepItems} maxItems={4} />;

export const CollapsedWithMoreContextDemo = () => <Breadcrumbs items={deepItems} maxItems={4} itemsBeforeCollapse={2} itemsAfterCollapse={2} />;

export const TruncatedLabelDemo = () => (
    <Breadcrumbs
        items={[
            { id: "home", label: "Home", href: "/", icon: Home01 },
            {
                id: "report",
                label: "Q3 2026 Financial Performance Review and Board Presentation",
                href: "/reports/q3-2026",
                icon: Folder,
                isTruncated: true,
            },
            { id: "current", label: "Executive summary and next steps for the leadership team", isTruncated: true },
        ]}
    />
);

export const ManualCompositionDemo = () => (
    <Breadcrumbs>
        <Breadcrumbs.Item href="/" label="Home" icon={Home01} />
        <Breadcrumbs.Item href="/library" label="Component library" />
        <Breadcrumbs.Item label="Breadcrumbs" />
    </Breadcrumbs>
);

export const RtlDemo = () => (
    <div dir="rtl">
        <Breadcrumbs items={basicItems} aria-label="مسار التنقل" />
    </div>
);

export const SizesDemo = () => (
    <div className="flex flex-col gap-4">
        <Breadcrumbs size="sm" items={basicItems} />
        <Breadcrumbs size="md" items={basicItems} />
    </div>
);
