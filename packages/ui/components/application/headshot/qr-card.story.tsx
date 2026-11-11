import type { FC } from "react";
import * as Demos from "@/components/application/headshot/qr-card.demo";

export default {
    title: "Application/Headshot/QR card",
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
    <div data-compare className="inline-flex flex-col items-start gap-4 bg-white p-0 pt-[5px] pr-2">
        <Demos.BasicDemo />
    </div>
);
