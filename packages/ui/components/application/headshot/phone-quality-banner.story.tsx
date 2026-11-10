import type { FC } from "react";
import * as Demos from "@/components/application/headshot/phone-quality-banner.demo";

export default {
    title: "Application/Headshot/Phone quality banner",
    decorators: [
        (Story: FC) => (
            <div className="flex min-h-screen w-full items-center justify-center bg-primary p-8">
                <Story />
            </div>
        ),
    ],
};

export const Basic = () => <Demos.BasicDemo />;

export const Figma = () => (
    <div data-compare className="inline-flex w-[362px] flex-col items-start gap-4 bg-white p-0">
        <Demos.BasicDemo />
    </div>
);
