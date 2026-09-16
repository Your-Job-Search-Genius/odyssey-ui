"use client";

import type { ChartTreeNode } from "@/components/application/charts/chart-types";
import { TreemapChart } from "@/components/application/charts/treemap-chart";

const jobCategories: ChartTreeNode = {
    name: "Matched jobs",
    children: [
        // collapse-start
        {
            name: "Engineering",
            children: [
                { name: "Frontend", value: 320 },
                { name: "Backend", value: 260 },
                { name: "DevOps", value: 110 },
                { name: "Mobile", value: 90 },
            ],
        },
        {
            name: "Data",
            children: [
                { name: "Analytics", value: 140 },
                { name: "ML", value: 95 },
            ],
        },
        {
            name: "Product",
            children: [
                { name: "PM", value: 120 },
                { name: "Design", value: 80 },
            ],
        },
        { name: "Other", value: 60 },
        // collapse-end
    ],
};

export const TreemapChartBasic = () => (
    <TreemapChart label="Matched jobs by category" title="Matched jobs by category" subtitle="1,275 open roles matching your profile" data={jobCategories} />
);

const locations: ChartTreeNode = {
    name: "Applications by location",
    children: [
        { name: "Remote", value: 128 },
        { name: "London", value: 64 },
        { name: "Berlin", value: 41 },
        { name: "Amsterdam", value: 27 },
        { name: "Dublin", value: 18 },
        { name: "Lisbon", value: 8 },
    ],
};

export const TreemapChartFlat = () => (
    <TreemapChart label="Applications by location" title="Applications by location" data={locations} height={200} showShare={false} />
);
