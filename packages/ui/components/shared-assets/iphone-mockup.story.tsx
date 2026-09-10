import type { FC } from "react";
import * as IPhoneMockupDemos from "@/components/shared-assets/iphone-mockup.demo";

export default {
    title: "Shared Assets/Miscellaneous assets/iPhone mockup",
    decorators: [
        (Story: FC) => (
            <div className="flex min-h-screen w-full items-center justify-center bg-primary p-8">
                <Story />
            </div>
        ),
    ],
};

export const Basic = () => <IPhoneMockupDemos.BasicDemo />;

export const DarkTheme = () => <IPhoneMockupDemos.DarkThemeDemo />;
