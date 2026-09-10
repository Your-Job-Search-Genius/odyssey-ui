"use client";

import { Illustration } from "@/components/shared-assets/illustrations";

export const BasicDemo = () => <Illustration type="cloud" />;

export const AllTypesDemo = () => (
    <div className="grid grid-cols-2 gap-6">
        {(["box", "cloud", "documents", "credit-card"] as const).map((type) => (
            <div key={type} className="flex flex-col items-center gap-2">
                <Illustration type={type} />
                <span className="text-xs text-tertiary">{type}</span>
            </div>
        ))}
    </div>
);

export const SizesDemo = () => (
    <div className="flex items-end gap-6">
        {(["sm", "md", "lg"] as const).map((size) => (
            <div key={size} className="flex flex-col items-center gap-2">
                <Illustration type="cloud" size={size} />
                <span className="text-xs text-tertiary">{size}</span>
            </div>
        ))}
    </div>
);
