"use client";

import { FunnelChart } from "@/components/application/charts/funnel-chart";

const pipeline = [
    { name: "Applied", value: 286 },
    { name: "Screened", value: 112 },
    { name: "Interviewed", value: 41 },
    { name: "Final round", value: 14 },
    { name: "Offers", value: 5 },
];

export const FunnelChartBasic = () => <FunnelChart label="Hiring pipeline conversion" title="Pipeline conversion" subtitle="Last 90 days" data={pipeline} />;

export const FunnelChartVertical = () => (
    <FunnelChart label="Hiring pipeline conversion" title="Pipeline conversion" data={pipeline} orientation="vertical" height={240} showTable />
);
