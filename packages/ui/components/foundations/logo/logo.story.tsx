import type { FC } from "react";
import * as LogoDemos from "@/components/foundations/logo/logo.demo";

export default {
    title: "Foundations/Logo",
    decorators: [
        (Story: FC) => (
            <div className="flex min-h-screen w-full items-center justify-center bg-primary p-8">
                <Story />
            </div>
        ),
    ],
};

export const Basic = () => <LogoDemos.BasicDemo />;

export const Minimal = () => <LogoDemos.MinimalDemo />;

export const OnDarkBackground = () => <LogoDemos.OnDarkBackgroundDemo />;
