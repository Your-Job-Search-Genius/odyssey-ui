"use client";

import { useState } from "react";
import { CropToolbar } from "@/components/application/headshot/crop-toolbar";

export const BasicDemo = () => {
    const [zoom, setZoom] = useState(1);
    const [rotation, setRotation] = useState(0);

    return (
        <div className="flex flex-col items-center gap-3 rounded-3xl bg-black/80 p-6">
            <CropToolbar
                zoom={zoom}
                onZoomChange={setZoom}
                onRotateLeft={() => setRotation((r) => r - 90)}
                onRotateRight={() => setRotation((r) => r + 90)}
                onReset={() => {
                    setZoom(1);
                    setRotation(0);
                }}
                isResetDisabled={zoom === 1 && rotation === 0}
                onReupload={() => {}}
            />
            <p className="text-xs text-white">
                Zoom {zoom.toFixed(2)}× · Rotation {rotation}°
            </p>
        </div>
    );
};
