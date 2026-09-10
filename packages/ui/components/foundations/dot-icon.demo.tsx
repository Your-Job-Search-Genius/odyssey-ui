"use client";

import { Dot } from "@/components/foundations/dot-icon";

export const BasicDemo = () => (
    <div className="flex items-center gap-1 text-fg-success-secondary">
        <Dot size="md" />
        <span className="text-sm font-medium text-secondary">Online</span>
    </div>
);

export const SizesDemo = () => (
    <div className="flex items-center gap-6">
        <div className="flex items-center gap-1.5">
            <Dot size="sm" className="text-fg-success-secondary" />
            <span className="text-sm text-tertiary">sm</span>
        </div>
        <div className="flex items-center gap-1.5">
            <Dot size="md" className="text-fg-success-secondary" />
            <span className="text-sm text-tertiary">md</span>
        </div>
    </div>
);

export const ColorsDemo = () => (
    <div className="flex items-center gap-4">
        <Dot className="text-fg-success-secondary" />
        <Dot className="text-fg-warning-secondary" />
        <Dot className="text-fg-error-secondary" />
        <Dot className="text-fg-quaternary" />
    </div>
);
