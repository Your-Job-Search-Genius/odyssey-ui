import type { FC } from "react";
import * as RatingBadgeDemos from "@/components/foundations/rating-badge.demo";

export default {
    title: "Foundations/Rating badge",
    decorators: [
        (Story: FC) => (
            <div className="flex min-h-screen w-full items-center justify-center bg-primary p-8">
                <Story />
            </div>
        ),
    ],
};

export const Basic = () => <RatingBadgeDemos.BasicDemo />;

export const CustomContent = () => <RatingBadgeDemos.CustomContentDemo />;

export const LightTheme = () => <RatingBadgeDemos.LightThemeDemo />;
