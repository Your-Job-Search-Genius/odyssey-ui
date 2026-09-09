"use client";

import { BrandLogo } from "@/components/foundations/logo/brand-logo";
import { BrandLogoMinimal } from "@/components/foundations/logo/brand-logo-minimal";

export const BasicDemo = () => <BrandLogo />;

export const MinimalDemo = () => <BrandLogoMinimal className="size-10" />;

export const OnDarkBackgroundDemo = () => (
    <div className="dark-mode flex items-center justify-center rounded-xl bg-primary p-6">
        <BrandLogo />
    </div>
);
