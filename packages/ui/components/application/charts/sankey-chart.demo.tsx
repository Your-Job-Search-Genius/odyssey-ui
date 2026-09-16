"use client";

import { SankeyChart } from "@/components/application/charts/sankey-chart";

const nodes = [
    // collapse-start
    { id: "linkedin", name: "LinkedIn" },
    { id: "indeed", name: "Indeed" },
    { id: "referrals", name: "Referrals" },
    { id: "screened", name: "Screened" },
    { id: "no-reply", name: "No reply" },
    { id: "interview", name: "Interview" },
    { id: "rejected", name: "Rejected" },
    { id: "offer", name: "Offer" },
    // collapse-end
];

const links = [
    // collapse-start
    { source: "linkedin", target: "screened", value: 46 },
    { source: "linkedin", target: "no-reply", value: 86 },
    { source: "indeed", target: "screened", value: 18 },
    { source: "indeed", target: "no-reply", value: 45 },
    { source: "referrals", target: "screened", value: 30 },
    { source: "referrals", target: "no-reply", value: 12 },
    { source: "screened", target: "interview", value: 41 },
    { source: "screened", target: "rejected", value: 53 },
    { source: "interview", target: "offer", value: 5 },
    { source: "interview", target: "rejected", value: 36 },
    // collapse-end
];

export const SankeyChartBasic = () => (
    <SankeyChart
        label="Where applications came from and where they ended"
        title="Application flow"
        subtitle="Source to outcome, last 90 days"
        nodes={nodes}
        links={links}
        mutedNodes={["no-reply", "rejected"]}
    />
);

const simpleNodes = [
    { id: "linkedin", name: "LinkedIn" },
    { id: "indeed", name: "Indeed" },
    { id: "referrals", name: "Referrals" },
    { id: "replied", name: "Replied" },
    { id: "silent", name: "No reply" },
];

const simpleLinks = [
    { source: "linkedin", target: "replied", value: 46 },
    { source: "linkedin", target: "silent", value: 86 },
    { source: "indeed", target: "replied", value: 18 },
    { source: "indeed", target: "silent", value: 45 },
    { source: "referrals", target: "replied", value: 30 },
    { source: "referrals", target: "silent", value: 12 },
];

export const SankeyChartSimple = () => (
    <SankeyChart label="Replies by application source" title="Replies by source" nodes={simpleNodes} links={simpleLinks} mutedNodes={["silent"]} height={200} />
);
