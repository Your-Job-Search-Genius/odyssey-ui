"use client";

import { ShutterButton } from "@/components/application/headshot/shutter-button";

export const BasicDemo = () => (
    <div className="rounded-[28px] bg-inverse p-8">
        <ShutterButton caption="Click the button above to take photo" onPress={() => {}} />
    </div>
);

export const DisabledDemo = () => (
    <div className="rounded-[28px] bg-inverse p-8">
        <ShutterButton caption="Starting camera…" isDisabled />
    </div>
);

/** Pose 3 of 4: two quarters done (green), the current one white. */
export const ProgressDemo = () => (
    <div className="rounded-[28px] bg-inverse p-8">
        <ShutterButton caption="Click the button above to take photo" currentStep={2} onPress={() => {}} />
    </div>
);
