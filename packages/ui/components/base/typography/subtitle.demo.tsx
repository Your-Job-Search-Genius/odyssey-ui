"use client";

import { Subtitle } from "@/components/base/typography/subtitle";
import { Title } from "@/components/base/typography/title";

export const Default = () => (
    <div className="flex flex-col items-start gap-1">
        <Title>Manage your workspace</Title>
        <Subtitle color="text-tertiary">Invite teammates and configure permissions</Subtitle>
    </div>
);
