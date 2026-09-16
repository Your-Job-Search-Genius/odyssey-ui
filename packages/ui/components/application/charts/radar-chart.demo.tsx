"use client";

import { RadarChart } from "@/components/application/charts/radar-chart";

const skills = [
    // collapse-start
    { axis: "Frontend", you: 90, role: 80 },
    { axis: "Backend", you: 70, role: 80 },
    { axis: "Cloud", you: 45, role: 70 },
    { axis: "Testing", you: 60, role: 70 },
    { axis: "Design", you: 75, role: 40 },
    { axis: "Leadership", you: 55, role: 60 },
    // collapse-end
];

export const RadarChartBasic = () => (
    <RadarChart
        label="Your skills against the role requirement"
        title="Skills match"
        subtitle="Self-assessment versus the Senior Frontend Engineer posting"
        data={skills}
        axisKey="axis"
        series={[
            { key: "role", name: "Role requirement", color: "var(--color-chart-4)" },
            { key: "you", name: "You", color: "var(--color-chart-1)" },
        ]}
        max={100}
    />
);

export const RadarChartSingleSeries = () => (
    <RadarChart label="Your skills profile" title="Your profile" data={skills} axisKey="axis" series={[{ key: "you", name: "You" }]} max={100} />
);

export const RadarChartWithoutDots = () => (
    <RadarChart
        label="Your skills against the role requirement"
        data={skills}
        axisKey="axis"
        series={[
            { key: "role", name: "Role requirement", color: "var(--color-chart-4)" },
            { key: "you", name: "You", color: "var(--color-chart-1)" },
        ]}
        max={100}
        showDots={false}
        legendPosition="bottom"
    />
);
