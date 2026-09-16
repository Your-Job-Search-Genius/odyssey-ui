"use client";

import { ScatterChart } from "@/components/application/charts/scatter-chart";

const jobs = [
    // collapse-start
    { title: "Frontend Engineer", type: "Remote", match: 92, salary: 148, openings: 4 },
    { title: "Full-stack Developer", type: "Hybrid", match: 84, salary: 132, openings: 9 },
    { title: "Platform Engineer", type: "On-site", match: 61, salary: 156, openings: 2 },
    { title: "Product Engineer", type: "Remote", match: 77, salary: 121, openings: 12 },
    { title: "Frontend Engineer", type: "Hybrid", match: 88, salary: 139, openings: 6 },
    { title: "Full-stack Developer", type: "On-site", match: 54, salary: 98, openings: 3 },
    { title: "Platform Engineer", type: "Remote", match: 69, salary: 162, openings: 5 },
    { title: "Product Engineer", type: "Hybrid", match: 73, salary: 118, openings: 8 },
    { title: "Frontend Engineer", type: "On-site", match: 81, salary: 112, openings: 1 },
    { title: "Full-stack Developer", type: "Remote", match: 95, salary: 144, openings: 14 },
    { title: "Platform Engineer", type: "Hybrid", match: 48, salary: 128, openings: 7 },
    { title: "Product Engineer", type: "On-site", match: 66, salary: 104, openings: 2 },
    { title: "Frontend Engineer", type: "Remote", match: 58, salary: 92, openings: 11 },
    { title: "Full-stack Developer", type: "Hybrid", match: 71, salary: 126, openings: 4 },
    { title: "Platform Engineer", type: "On-site", match: 86, salary: 151, openings: 3 },
    { title: "Product Engineer", type: "Remote", match: 63, salary: 109, openings: 6 },
    { title: "Frontend Engineer", type: "Hybrid", match: 79, salary: 135, openings: 10 },
    { title: "Full-stack Developer", type: "On-site", match: 44, salary: 87, openings: 5 },
    { title: "Platform Engineer", type: "Remote", match: 90, salary: 168, openings: 2 },
    { title: "Product Engineer", type: "Hybrid", match: 52, salary: 114, openings: 9 },
    { title: "Frontend Engineer", type: "On-site", match: 74, salary: 122, openings: 3 },
    { title: "Full-stack Developer", type: "Remote", match: 67, salary: 137, openings: 13 },
    { title: "Platform Engineer", type: "Hybrid", match: 57, salary: 141, openings: 1 },
    { title: "Product Engineer", type: "On-site", match: 83, salary: 119, openings: 4 },
    // collapse-end
];

const percent = (value: number) => `${Math.round(value)}%`;
const salary = (value: number) => `$${Math.round(value)}k`;

export const ScatterChartBasic = () => (
    <ScatterChart
        label="Salary against match score for matched jobs"
        title="Salary vs match score"
        subtitle="Each point is a matched job post"
        data={jobs}
        xKey="match"
        yKey="salary"
        labelKey="title"
        xFormatter={percent}
        yFormatter={salary}
    />
);

export const ScatterChartBubble = () => (
    <ScatterChart
        label="Salary against match score, sized by openings"
        title="Salary vs match score"
        subtitle="Bubble size shows the number of openings"
        data={jobs}
        xKey="match"
        yKey="salary"
        sizeKey="openings"
        labelKey="title"
        xFormatter={percent}
        yFormatter={salary}
    />
);

export const ScatterChartCategories = () => (
    <ScatterChart
        label="Salary against match score by work arrangement"
        title="Salary vs match score"
        subtitle="Colored by work arrangement, sized by openings"
        data={jobs}
        xKey="match"
        yKey="salary"
        sizeKey="openings"
        categoryKey="type"
        labelKey="title"
        xFormatter={percent}
        yFormatter={salary}
        height={280}
    />
);
