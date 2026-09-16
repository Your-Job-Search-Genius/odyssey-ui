"use client";

import { PieChart } from "@/components/application/charts/pie-chart";

const sources = [
    { name: "LinkedIn", value: 132 },
    { name: "Indeed", value: 63 },
    { name: "Referrals", value: 49 },
    { name: "Company sites", value: 31 },
    { name: "Other", value: 11 },
];

const manySources = [
    // collapse-start
    { name: "LinkedIn", value: 132 },
    { name: "Indeed", value: 63 },
    { name: "Referrals", value: 49 },
    { name: "Company sites", value: 31 },
    { name: "Glassdoor", value: 18 },
    { name: "Wellfound", value: 12 },
    { name: "Recruiters", value: 9 },
    { name: "Meetups", value: 5 },
    { name: "Job fairs", value: 3 },
    // collapse-end
];

export const PieChartDonut = () => <PieChart label="Applications by source" title="Applications by source" subtitle="Last 90 days" data={sources} />;

export const PieChartPie = () => <PieChart label="Applications by source" title="Applications by source" data={sources} innerRadius={0} />;

export const PieChartLegendBottom = () => (
    <PieChart label="Applications by source" title="Applications by source" data={sources} legendPosition="bottom" height={200} />
);

export const PieChartFoldedOther = () => (
    <PieChart
        label="Applications by source, nine sources folded to six slices"
        title="Nine sources, six slices"
        subtitle="The tail folds into Other"
        data={manySources}
    />
);

export const PieChartCustomCenter = () => (
    <PieChart label="Applications by source" title="Applications by source" data={sources} centerValue={286} centerLabel="applications" />
);
