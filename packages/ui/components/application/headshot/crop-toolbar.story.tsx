import type { FC } from "react";
import { CropToolbar } from "@/components/application/headshot/crop-toolbar";
import * as Demos from "@/components/application/headshot/crop-toolbar.demo";
import { GlassPill } from "@/components/application/headshot/glass-pill";

const noop = () => {};

export default {
    title: "Application/Headshot/Crop toolbar",
    decorators: [
        (Story: FC) => (
            <div className="flex min-h-screen w-full items-center justify-center bg-primary p-8">
                <Story />
            </div>
        ),
    ],
};

export const Basic = () => <Demos.BasicDemo />;

export const Phone = () => <Demos.PhoneDemo />;

// Figma's thumb sits 12px into the 167px travel.
const figmaZoom = 1 + (2 * 12) / 167;

export const Figma = () => (
    <div data-compare className="inline-flex flex-col items-start gap-4 bg-white p-0">
        <CropToolbar zoom={figmaZoom} onZoomChange={noop} onRotateLeft={noop} onRotateRight={noop} onReset={noop} isResetDisabled onReupload={noop} />
    </div>
);

/** Toolbar and "Skip this photo" over the dark crop overlay, as in the crop dialog. */
export const FigmaOnPhoto = () => (
    <div data-compare className="inline-flex items-center gap-2 rounded-3xl bg-[#1d2a2c] p-6">
        <CropToolbar zoom={figmaZoom} onZoomChange={noop} onRotateLeft={noop} onRotateRight={noop} onReset={noop} isResetDisabled onReupload={noop} />
        <GlassPill variant="light" className="h-[41px]">
            Skip this photo
        </GlassPill>
    </div>
);

/** Phone layout (Figma 14881:11187): two full-width frosted pills, Re-Upload left to the screen's bottom bar. */
export const FigmaPhone = () => (
    <div data-compare className="inline-flex w-[384px] flex-col items-start bg-[#34220d] p-0">
        <CropToolbar size="sm" zoom={1.04} onZoomChange={noop} onRotateLeft={noop} onRotateRight={noop} onReset={noop} isResetDisabled />
    </div>
);
