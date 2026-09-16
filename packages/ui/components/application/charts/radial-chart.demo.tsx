"use client";

import { RadialChart } from "@/components/application/charts/radial-chart";

const scores = [
    { name: "Resume score", value: 82 },
    { name: "Job match", value: 67 },
    { name: "Profile", value: 91 },
];

export const RadialChartRings = () => <RadialChart label="Resume score, job match and profile completeness" title="Your readiness" data={scores} />;

export const RadialChartGauge = () => (
    <RadialChart label="Resume score out of 100" title="Resume score" data={[{ name: "Resume score", value: 82, max: 100 }]} variant="gauge" />
);

export const RadialChartProgress = () => <RadialChart label="Profile completeness" data={[{ name: "Profile", value: 91 }]} variant="progress" />;

export const RadialChartProgressSizes = () => (
    <div className="flex flex-wrap items-end gap-8">
        <div className="w-16">
            <RadialChart label="Profile completeness, extra small" data={[{ name: "Profile", value: 40 }]} variant="progress" size="xs" />
        </div>
        <div className="w-24">
            <RadialChart label="Profile completeness, small" data={[{ name: "Profile", value: 40 }]} variant="progress" size="sm" />
        </div>
        <div className="w-32">
            <RadialChart label="Profile completeness, medium" data={[{ name: "Profile", value: 40 }]} variant="progress" size="md" />
        </div>
        <div className="w-40">
            <RadialChart label="Profile completeness, large" data={[{ name: "Profile", value: 40 }]} variant="progress" size="lg" />
        </div>
    </div>
);
