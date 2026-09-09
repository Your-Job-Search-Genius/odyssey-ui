"use client";

import { IPhoneMockup } from "@/components/shared-assets/iphone-mockup";

const screenshot = "https://www.untitledui.com/images/photos/mira-collins.jpg";

export const BasicDemo = () => (
    <div className="w-40">
        <IPhoneMockup image={screenshot} />
    </div>
);

export const DarkThemeDemo = () => (
    <div className="w-40">
        <IPhoneMockup image={screenshot} theme="dark" />
    </div>
);
