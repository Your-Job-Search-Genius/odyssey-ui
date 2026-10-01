"use client";

import { StatTile, StatTileGroup } from "@/components/application/charts/stat-tile";
import { Send01, SlashCircle01 } from "@/components/foundations/icons";

const views = [30, 34, 31, 40, 44, 42, 51, 56, 54, 63, 66, 72];
const applications = [18, 22, 20, 26, 24, 31, 29, 33, 36, 35, 41, 44];
const responseRate = [36, 35, 37, 34, 33, 35, 32, 33, 31, 32, 30, 31];

export const StatTileBasic = () => <StatTile label="Profile views" value={1284} delta={{ value: "+12.4%", direction: "up", caption: "vs last month" }} />;

export const StatTileWithTrend = () => (
    <div className="w-64">
        <StatTile label="Applications sent" value={286} delta={{ value: "+8.1%", direction: "up", caption: "vs last month" }} trend={applications} />
    </div>
);

export const StatTileGroupDemo = () => (
    <StatTileGroup>
        <StatTile label="Profile views" value={1284} delta={{ value: "+12.4%", direction: "up", caption: "vs last month" }} trend={views} />
        <StatTile label="Applications sent" value={286} delta={{ value: "+8.1%", direction: "up", caption: "vs last month" }} trend={applications} />
        <StatTile label="Response rate" value="31%" delta={{ value: "−2.3 pts", direction: "down", caption: "vs last month" }} trend={responseRate} />
    </StatTileGroup>
);

export const StatTileSizes = () => (
    <div className="flex flex-col gap-6 sm:flex-row sm:gap-10">
        <StatTile size="sm" label="Interviews" value={13} delta={{ value: "+4", direction: "up" }} />
        <StatTile size="md" label="Interviews" value={13} delta={{ value: "+4", direction: "up" }} />
        <StatTile size="lg" label="Interviews" value={13} delta={{ value: "0", direction: "flat", caption: "vs last week" }} />
    </div>
);

/** Decorative icon before the label, and supporting text under the value. */
export const StatTileWithIconAndDescription = () => (
    <StatTileGroup columns={2}>
        <StatTile
            label="Emails sent"
            icon={Send01}
            value={12840}
            description="Across 12 active campaigns"
            delta={{ value: "+6.2%", direction: "up", caption: "vs last week" }}
        />
        <StatTile
            label="New blocks"
            icon={SlashCircle01}
            value={14}
            description="Bounces and spam reports"
            delta={{ value: "+3", direction: "up", isPositive: false, caption: "vs last week" }}
        />
    </StatTileGroup>
);
