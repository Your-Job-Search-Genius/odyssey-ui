"use client";

import { BackgroundPattern } from "@/components/shared-assets/background-patterns";

export const BasicDemo = () => (
    <div className="relative flex size-48 items-center justify-center overflow-hidden rounded-xl bg-secondary text-tertiary">
        <BackgroundPattern pattern="grid" className="absolute inset-0" />
    </div>
);

export const AllPatternsDemo = () => (
    <div className="grid grid-cols-2 gap-4">
        {(["circle", "square", "grid", "grid-check"] as const).map((pattern) => (
            <div key={pattern} className="relative flex h-32 w-40 flex-col items-center justify-center overflow-hidden rounded-xl bg-secondary text-tertiary">
                <BackgroundPattern pattern={pattern} className="absolute inset-0" />
                <span className="z-10 rounded-md bg-primary px-2 py-1 text-xs font-medium text-secondary shadow-xs">{pattern}</span>
            </div>
        ))}
    </div>
);

export const SizesDemo = () => (
    <div className="flex gap-4">
        {(["sm", "md", "lg"] as const).map((size) => (
            <div key={size} className="relative flex h-32 w-40 items-center justify-center overflow-hidden rounded-xl bg-secondary text-tertiary">
                <BackgroundPattern pattern="grid" size={size} className="absolute inset-0" />
                <span className="z-10 rounded-md bg-primary px-2 py-1 text-xs font-medium text-secondary shadow-xs">{size}</span>
            </div>
        ))}
    </div>
);
