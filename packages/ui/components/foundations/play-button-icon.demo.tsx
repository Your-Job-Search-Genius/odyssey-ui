"use client";

import { useState } from "react";
import { PlayButtonIcon } from "@/components/foundations/play-button-icon";

export const BasicDemo = () => (
    <div className="relative flex h-48 w-80 items-center justify-center overflow-hidden rounded-xl bg-linear-to-br from-neutral-700 to-neutral-900">
        <PlayButtonIcon />
    </div>
);

export const InteractiveDemo = () => {
    const [isPlaying, setIsPlaying] = useState(false);

    return (
        <div className="relative flex h-48 w-80 items-center justify-center overflow-hidden rounded-xl bg-linear-to-br from-neutral-700 to-neutral-900">
            <button type="button" onClick={() => setIsPlaying((v) => !v)} className="cursor-pointer">
                <PlayButtonIcon isPlaying={isPlaying} />
            </button>
        </div>
    );
};
