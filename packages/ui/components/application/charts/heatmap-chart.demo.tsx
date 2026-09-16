"use client";

import type { HeatmapCell } from "@/components/application/charts/heatmap-chart";
import { HeatmapChart } from "@/components/application/charts/heatmap-chart";

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const weeks = Array.from({ length: 16 }, (_, i) => `W${i + 1}`);

// Deterministic pseudo-random activity so the demo renders identically every time.
const seeded = (seed: number) => {
    let state = seed;
    return () => {
        state = (state * 1664525 + 1013904223) % 4294967296;
        return state / 4294967296;
    };
};

const calendarData: HeatmapCell[] = (() => {
    // collapse-start
    const random = seeded(3);
    const cells: HeatmapCell[] = [];
    weeks.forEach((week, w) => {
        days.forEach((day, d) => {
            const weekend = d > 4;
            const value = weekend ? (random() < 0.7 ? 0 : 1) : Math.round(random() * 6 * (0.4 + w / weeks.length));
            cells.push({ x: week, y: day, value });
        });
    });
    return cells;
    // collapse-end
})();

export const HeatmapChartCalendar = () => (
    <HeatmapChart
        label="Job-search activities per day over 16 weeks"
        title="Daily activity"
        subtitle="Applications, messages and interviews logged per day"
        data={calendarData}
        xDomain={weeks}
        yDomain={days}
        xTickEvery={4}
    />
);

const skills = ["React", "TypeScript", "Node.js", "SQL", "AWS", "Python"];
const categories = ["Frontend", "Full-stack", "Backend", "Data", "Platform"];
const matrixValues = [
    // collapse-start
    [96, 82, 12, 4, 18],
    [91, 88, 44, 9, 52],
    [22, 79, 86, 14, 61],
    [8, 41, 73, 92, 37],
    [15, 48, 69, 33, 95],
    [6, 24, 58, 97, 64],
    // collapse-end
];
const matrixData: HeatmapCell[] = skills.flatMap((skill, r) => categories.map((category, c) => ({ x: category, y: skill, value: matrixValues[r][c] })));

export const HeatmapChartMatrix = () => (
    <HeatmapChart
        label="Share of job posts mentioning each skill, by role category"
        title="Skill demand by role"
        subtitle="Percent of matched posts"
        data={matrixData}
        xDomain={categories}
        yDomain={skills}
        showValues
        valueFormatter={(v) => `${v}%`}
        height={220}
    />
);

const sources = ["LinkedIn", "Indeed", "Referrals", "Company sites"];
const changeWeeks = ["W7", "W8", "W9", "W10", "W11", "W12"];
const changes = [
    // collapse-start
    [4, 7, -2, 9, 12, 6],
    [-3, 2, 5, -6, 1, -8],
    [1, 3, 6, 8, -1, 10],
    [-5, -2, 0, 3, -4, 2],
    // collapse-end
];
const divergingData: HeatmapCell[] = sources.flatMap((source, r) => changeWeeks.map((week, c) => ({ x: week, y: source, value: changes[r][c] })));

export const HeatmapChartDiverging = () => (
    <HeatmapChart
        label="Change in applications per source versus the previous week"
        title="Applications, week over week"
        subtitle="Change versus the previous week"
        data={divergingData}
        xDomain={changeWeeks}
        yDomain={sources}
        colorScale="diverging"
        showValues
        valueFormatter={(v) => (v > 0 ? `+${v}` : `${v}`)}
        height={180}
    />
);

export const HeatmapChartEmpty = () => <HeatmapChart label="Daily activity" title="Daily activity" data={[]} height={160} />;
