"use client";

import { SectionDivider } from "@/components/shared-assets/section-divider";

export const BasicDemo = () => (
    <div className="w-full">
        <p className="mb-4 px-4 text-sm text-tertiary">Section one content</p>
        <SectionDivider />
        <p className="mt-4 px-4 text-sm text-tertiary">Section two content</p>
    </div>
);
