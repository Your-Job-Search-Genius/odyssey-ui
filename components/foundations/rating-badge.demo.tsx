"use client";

import { RatingBadge } from "@/components/foundations/rating-badge";

export const BasicDemo = () => <RatingBadge />;

export const CustomContentDemo = () => <RatingBadge title="Best Support" subtitle="4.9 out of 5" rating={4.9} />;

export const LightThemeDemo = () => (
    <div className="rounded-xl bg-brand-solid p-8">
        <RatingBadge theme="light" />
    </div>
);
