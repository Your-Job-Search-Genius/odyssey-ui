"use client";

import type { ChartTreeNode } from "@/components/application/charts/chart-types";
import { SunburstChart } from "@/components/application/charts/sunburst-chart";

const industries: ChartTreeNode = {
    name: "Applications",
    children: [
        // collapse-start
        {
            name: "SaaS",
            children: [
                { name: "Frontend", value: 28 },
                { name: "Full-stack", value: 19 },
                { name: "Platform", value: 8 },
            ],
        },
        {
            name: "Fintech",
            children: [
                { name: "Backend", value: 16 },
                { name: "Data", value: 9 },
            ],
        },
        {
            name: "Health",
            children: [
                { name: "Mobile", value: 7 },
                { name: "QA", value: 5 },
            ],
        },
        { name: "Agencies", children: [{ name: "Design eng", value: 6 }] },
        // collapse-end
    ],
};

export const SunburstChartBasic = () => (
    <SunburstChart
        label="Applications by industry and role"
        title="Where you have applied"
        subtitle="Industries and roles"
        data={industries}
        centerLabel="applied"
    />
);

export const SunburstChartCustomCenter = () => (
    <SunburstChart label="Applications by industry and role" data={industries} centerValue="4 sectors" centerLabel="in play" showLegend={false} height={260} />
);
