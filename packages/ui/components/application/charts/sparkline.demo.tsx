"use client";

import { Sparkline } from "@/components/application/charts/sparkline";

const views = [30, 34, 31, 40, 44, 42, 51, 56, 54, 63, 66, 72];
const responseRate = [36, 35, 37, 34, 33, 35, 32, 33, 31, 32, 30, 31];

export const SparklineLine = () => (
    <div className="w-48">
        <Sparkline data={views} variant="line" label="Profile views trend over 12 weeks, rising" />
    </div>
);

export const SparklineArea = () => (
    <div className="w-48">
        <Sparkline data={views} variant="area" label="Profile views trend over 12 weeks, rising" />
    </div>
);

export const SparklineBar = () => (
    <div className="w-48">
        <Sparkline data={responseRate} variant="bar" color="var(--color-fg-error-primary)" label="Response rate trend over 12 weeks, falling" />
    </div>
);
