"use client";

import { Paragraph } from "@/components/base/typography/paragraph";
import { Strong } from "@/components/base/typography/strong";

export const Default = () => (
    <Paragraph className="max-w-md">
        Your subscription renews on <Strong>March 12, 2026</Strong>. Cancel any time before then to avoid being charged.
    </Paragraph>
);
