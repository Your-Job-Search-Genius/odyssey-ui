"use client";

import { useState } from "react";
import { BarChart } from "@/components/application/charts/bar-chart";
import { Button } from "@/components/base/buttons/button";

const months = [
    // collapse-start
    { month: "Apr", applications: 62, interviews: 8 },
    { month: "May", applications: 78, interviews: 12 },
    { month: "Jun", applications: 91, interviews: 15 },
    { month: "Jul", applications: 84, interviews: 14 },
    { month: "Aug", applications: 110, interviews: 21 },
    { month: "Sep", applications: 128, interviews: 26 },
    // collapse-end
];

const pipeline = [
    // collapse-start
    { week: "W5", applied: 14, screening: 5, interview: 2, offer: 0 },
    { week: "W6", applied: 17, screening: 6, interview: 3, offer: 0 },
    { week: "W7", applied: 20, screening: 8, interview: 4, offer: 0 },
    { week: "W8", applied: 23, screening: 9, interview: 5, offer: 0 },
    { week: "W9", applied: 26, screening: 11, interview: 6, offer: 1 },
    { week: "W10", applied: 29, screening: 12, interview: 7, offer: 2 },
    { week: "W11", applied: 32, screening: 14, interview: 8, offer: 3 },
    { week: "W12", applied: 35, screening: 15, interview: 9, offer: 4 },
    // collapse-end
];

const skills = [
    // collapse-start
    { skill: "React", posts: 412 },
    { skill: "TypeScript", posts: 388 },
    { skill: "Node.js", posts: 301 },
    { skill: "SQL", posts: 264 },
    { skill: "AWS", posts: 233 },
    { skill: "Python", posts: 199 },
    { skill: "GraphQL", posts: 122 },
    // collapse-end
];

const benchmark = [
    // collapse-start
    { skill: "Leadership", delta: 18 },
    { skill: "Communication", delta: 11 },
    { skill: "System design", delta: 6 },
    { skill: "Testing", delta: -4 },
    { skill: "Cloud", delta: -9 },
    { skill: "Data modelling", delta: -15 },
    // collapse-end
];

export const BarChartBasic = () => (
    <BarChart
        label="Applications sent per month"
        title="Applications sent"
        subtitle="April to September"
        data={months}
        xKey="month"
        series={[{ key: "applications", name: "Applications" }]}
    />
);

export const BarChartGrouped = () => (
    <BarChart
        label="Applications and interviews per month"
        title="Applications and interviews"
        data={months}
        xKey="month"
        series={[
            { key: "applications", name: "Applications" },
            { key: "interviews", name: "Interviews" },
        ]}
    />
);

export const BarChartStacked = () => (
    <BarChart
        label="Pipeline stage by week"
        title="Pipeline by stage"
        data={pipeline}
        xKey="week"
        mode="stacked"
        legendPosition="bottom"
        series={[
            { key: "applied", name: "Applied" },
            { key: "screening", name: "Screening" },
            { key: "interview", name: "Interview" },
            { key: "offer", name: "Offer" },
        ]}
    />
);

export const BarChartHorizontal = () => (
    <BarChart
        label="Skills demanded in matched job posts"
        title="Skills in demand"
        subtitle="Mentions across matched job posts"
        data={skills}
        xKey="skill"
        orientation="horizontal"
        showValues
        height={7 * 36 + 12}
        series={[{ key: "posts", name: "Job posts" }]}
    />
);

export const BarChartDiverging = () => (
    <BarChart
        label="Your score versus the role benchmark by skill"
        title="Score vs benchmark"
        subtitle="Points above or below the role benchmark"
        data={benchmark}
        xKey="skill"
        orientation="horizontal"
        mode="diverging"
        showValues
        height={6 * 34 + 12}
        series={[{ key: "delta", name: "vs benchmark" }]}
    />
);

export const BarChartWithValues = () => (
    <BarChart
        label="Interviews per month"
        title="Interviews"
        data={months}
        xKey="month"
        showValues
        height={220}
        series={[{ key: "interviews", name: "Interviews" }]}
    />
);

const shuffle = (rows: typeof months) =>
    rows.map((row) => ({
        ...row,
        applications: Math.round(row.applications * (0.6 + Math.random() * 0.8)),
        interviews: Math.round(row.interviews * (0.6 + Math.random() * 0.8)),
    }));

export const BarChartLiveUpdate = () => {
    const [data, setData] = useState(months);
    return (
        <BarChart
            label="Applications and interviews per month"
            title="Applications and interviews"
            subtitle="Data updates tween from the previous geometry"
            data={data}
            xKey="month"
            series={[
                { key: "applications", name: "Applications" },
                { key: "interviews", name: "Interviews" },
            ]}
            actions={
                <Button size="sm" color="secondary" onClick={() => setData(shuffle(months))}>
                    Randomise
                </Button>
            }
        />
    );
};

export const BarChartEmpty = () => (
    <BarChart
        label="Applications sent per month"
        title="Applications sent"
        data={[]}
        xKey="month"
        series={[{ key: "applications", name: "Applications" }]}
        height={200}
    />
);
