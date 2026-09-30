"use client";

import { Badge } from "@/components/base/badges/badges";
import { cx } from "@/utils/cx";

const applications = [
    { company: "Figma", role: "Product Designer", stage: "Interview" },
    { company: "Linear", role: "Frontend Engineer", stage: "Applied" },
    { company: "Stripe", role: "Design Systems Lead", stage: "Offer" },
    { company: "Notion", role: "UX Researcher", stage: "No reply" },
    { company: "Vercel", role: "Developer Advocate", stage: "Applied" },
    { company: "Duolingo", role: "Content Designer", stage: "Interview" },
    { company: "Canva", role: "Senior UI Engineer", stage: "Applied" },
    { company: "Spotify", role: "Product Manager", stage: "No reply" },
    { company: "Shopify", role: "Staff Designer", stage: "Interview" },
    { company: "Atlassian", role: "Accessibility Specialist", stage: "Applied" },
    { company: "GitLab", role: "Frontend Engineer", stage: "No reply" },
    { company: "Intercom", role: "Conversation Designer", stage: "Interview" },
] as const;

const stageColor = { Interview: "success", Applied: "gray", Offer: "brand", "No reply": "warning" } as const;

const weeks = [
    { week: 31, sent: 9, replies: 2 },
    { week: 32, sent: 12, replies: 3 },
    { week: 33, sent: 7, replies: 1 },
    { week: 34, sent: 14, replies: 4 },
    { week: 35, sent: 11, replies: 5 },
    { week: 36, sent: 16, replies: 3 },
    { week: 37, sent: 10, replies: 2 },
    { week: 38, sent: 18, replies: 6 },
    { week: 39, sent: 13, replies: 4 },
    { week: 40, sent: 15, replies: 5 },
];

/** A vertically scrolling list of job applications. */
const ApplicationList = ({ className }: { className?: string }) => (
    <div
        tabIndex={0}
        aria-label="Applications"
        className={cx("h-52 overflow-y-auto rounded-xl bg-primary ring-1 ring-secondary outline-focus-ring ring-inset focus-visible:outline-2", className)}
    >
        <ul className="divide-y divide-secondary">
            {applications.map((item) => (
                <li key={item.company} className="flex items-center gap-3 px-4 py-2.5">
                    <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-primary">{item.role}</p>
                        <p className="text-xs text-tertiary">{item.company}</p>
                    </div>
                    <Badge size="sm" type="pill-color" color={stageColor[item.stage]}>
                        {item.stage}
                    </Badge>
                </li>
            ))}
        </ul>
    </div>
);

/** A horizontally scrolling strip of weekly totals. */
const WeeklyStrip = ({ className }: { className?: string }) => (
    <div
        tabIndex={0}
        aria-label="Weekly pipeline"
        className={cx("overflow-x-auto rounded-xl bg-primary ring-1 ring-secondary outline-focus-ring ring-inset focus-visible:outline-2", className)}
    >
        <ul className="flex w-max gap-2.5 p-3">
            {weeks.map((item) => (
                <li key={item.week} className="w-32 shrink-0 rounded-lg bg-secondary px-3 py-2.5 ring-1 ring-secondary ring-inset">
                    <p className="text-xs text-tertiary">Week {item.week}</p>
                    <p className="text-lg font-semibold text-primary tabular-nums">{item.sent} sent</p>
                    <p className="text-xs text-tertiary tabular-nums">{item.replies} replies</p>
                </li>
            ))}
        </ul>
    </div>
);

/* No class needed: every scroll area gets the Ruled scrollbar by default. */
export const DefaultDemo = () => (
    <div className="grid w-full max-w-md gap-3">
        <ApplicationList />
        <WeeklyStrip />
    </div>
);

export const RuledDemo = () => (
    <div className="grid w-full max-w-md gap-3 scrollbar-ruled">
        <ApplicationList />
        <WeeklyStrip />
    </div>
);

export const HairlineDemo = () => (
    <div className="grid w-full max-w-md gap-3 scrollbar-hairline">
        <ApplicationList />
        <WeeklyStrip />
    </div>
);

export const PillDemo = () => (
    <div className="grid w-full max-w-md gap-3 scrollbar-pill">
        <ApplicationList />
        <WeeklyStrip />
    </div>
);

export const OverlayDemo = () => (
    <div className="grid w-full max-w-md gap-3 scrollbar-overlay">
        <ApplicationList />
        <WeeklyStrip />
    </div>
);

export const InkDemo = () => (
    <div className="grid w-full max-w-md gap-3 scrollbar-ink">
        <ApplicationList />
        <WeeklyStrip />
    </div>
);

export const RailDemo = () => (
    <div className="grid w-full max-w-md gap-3 scrollbar-rail">
        <ApplicationList />
        <WeeklyStrip />
    </div>
);

export const HiddenDemo = () => (
    <div className="grid w-full max-w-md gap-3">
        <ApplicationList className="scrollbar-hide" />
        <WeeklyStrip className="scrollbar-hide" />
    </div>
);

const variants = [
    { className: "scrollbar-ruled", name: "Ruled", description: "Default. Tick-marked track, gripped brand thumb." },
    { className: "scrollbar-hairline", name: "Hairline", description: "4px neutral thumb, no track, widens on hover." },
    { className: "scrollbar-pill", name: "Pill", description: "Brand thumb inside a tinted brand track." },
    { className: "scrollbar-overlay", name: "Overlay", description: "Hidden until the area is hovered or focused." },
    { className: "scrollbar-ink", name: "Ink", description: "Brand gradient thumb in a recessed track." },
    { className: "scrollbar-rail", name: "Rail", description: "Brand bead riding on a 2px guide line." },
];

export const AllVariantsDemo = () => (
    <div className="grid w-full max-w-5xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {variants.map((variant) => (
            <div key={variant.className} className={cx(variant.className, "flex min-w-0 flex-col gap-3")}>
                <div>
                    <p className="text-sm font-semibold text-primary">{variant.name}</p>
                    <p className="text-xs text-tertiary">
                        <code>{variant.className}</code> · {variant.description}
                    </p>
                </div>
                <ApplicationList />
                <WeeklyStrip />
            </div>
        ))}
    </div>
);
