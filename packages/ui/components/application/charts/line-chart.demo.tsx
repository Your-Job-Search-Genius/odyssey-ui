"use client";

import { useState } from "react";
import { LineChart } from "@/components/application/charts/line-chart";
import { Button } from "@/components/base/buttons/button";

const weeks = [
    // collapse-start
    { week: "W1", applications: 12, responses: 3, interviews: 0 },
    { week: "W2", applications: 18, responses: 6, interviews: 1 },
    { week: "W3", applications: 15, responses: 5, interviews: 2 },
    { week: "W4", applications: 22, responses: 9, interviews: 2 },
    { week: "W5", applications: 27, responses: 11, interviews: 4 },
    { week: "W6", applications: 25, responses: 10, interviews: 3 },
    { week: "W7", applications: 31, responses: 14, interviews: 5 },
    { week: "W8", applications: 34, responses: 15, interviews: 6 },
    { week: "W9", applications: 41, responses: 19, interviews: 8 },
    { week: "W10", applications: 48, responses: 24, interviews: 11 },
    { week: "W11", applications: 44, responses: 21, interviews: 9 },
    { week: "W12", applications: 52, responses: 27, interviews: 13 },
    // collapse-end
];

const sources = [
    // collapse-start
    { week: "W1", linkedin: 5, indeed: 4, referrals: 1, company: 2 },
    { week: "W2", linkedin: 7, indeed: 5, referrals: 2, company: 3 },
    { week: "W3", linkedin: 8, indeed: 6, referrals: 4, company: 3 },
    { week: "W4", linkedin: 10, indeed: 7, referrals: 2, company: 4 },
    { week: "W5", linkedin: 11, indeed: 8, referrals: 3, company: 5 },
    { week: "W6", linkedin: 13, indeed: 8, referrals: 5, company: 6 },
    { week: "W7", linkedin: 15, indeed: 9, referrals: 4, company: 6 },
    { week: "W8", linkedin: 16, indeed: 10, referrals: 5, company: 7 },
    { week: "W9", linkedin: 18, indeed: 11, referrals: 7, company: 8 },
    { week: "W10", linkedin: 19, indeed: 12, referrals: 6, company: 8 },
    { week: "W11", linkedin: 21, indeed: 12, referrals: 7, company: 9 },
    { week: "W12", linkedin: 23, indeed: 13, referrals: 9, company: 10 },
    // collapse-end
];

const pipelineSeries = [
    { key: "applications", name: "Applications" },
    { key: "responses", name: "Responses" },
    { key: "interviews", name: "Interviews" },
] as const;

export const LineChartBasic = () => (
    <LineChart
        label="Applications, responses and interviews by week"
        title="Pipeline activity"
        subtitle="Last 12 weeks"
        data={weeks}
        xKey="week"
        series={[...pipelineSeries]}
    />
);

export const LineChartEndLabels = () => (
    <LineChart
        label="Applications, responses and interviews by week"
        data={weeks}
        xKey="week"
        series={[...pipelineSeries]}
        showEndLabels
        showLegend={false}
        height={260}
    />
);

export const LineChartArea = () => (
    <LineChart
        label="Applications sent per week"
        title="Applications sent"
        subtitle="Single series, area wash"
        data={weeks}
        xKey="week"
        series={[{ key: "applications", name: "Applications" }]}
        variant="area"
        showDots
    />
);

export const LineChartStackedArea = () => (
    <LineChart
        label="Applications by source per week"
        title="Applications by source"
        data={sources}
        xKey="week"
        series={[
            { key: "linkedin", name: "LinkedIn" },
            { key: "indeed", name: "Indeed" },
            { key: "referrals", name: "Referrals" },
            { key: "company", name: "Company sites" },
        ]}
        variant="stacked-area"
        legendPosition="bottom"
    />
);

export const LineChartStep = () => (
    <LineChart
        label="Interviews per week"
        title="Interviews"
        data={weeks}
        xKey="week"
        series={[{ key: "interviews", name: "Interviews" }]}
        curve="step"
        showDots
        height={200}
    />
);

export const LineChartWithTable = () => (
    <LineChart
        label="Applications and responses by week"
        title="Applications and responses"
        data={weeks}
        xKey="week"
        series={[pipelineSeries[0], pipelineSeries[1]]}
        showTable
        height={220}
    />
);

const shuffle = (rows: typeof weeks) =>
    rows.map((row) => ({
        ...row,
        applications: Math.round(row.applications * (0.6 + Math.random() * 0.8)),
        responses: Math.round(row.responses * (0.6 + Math.random() * 0.8)),
    }));

export const LineChartLiveUpdate = () => {
    const [data, setData] = useState(weeks);
    return (
        <LineChart
            label="Applications and responses by week"
            title="Applications and responses"
            subtitle="Data updates tween from the previous geometry"
            data={data}
            xKey="week"
            series={[pipelineSeries[0], pipelineSeries[1]]}
            actions={
                <Button size="sm" color="secondary" onClick={() => setData(shuffle(weeks))}>
                    Randomise
                </Button>
            }
        />
    );
};

export const LineChartEmpty = () => (
    <LineChart label="Applications by week" title="Pipeline activity" data={[]} xKey="week" series={[...pipelineSeries]} height={200} />
);
