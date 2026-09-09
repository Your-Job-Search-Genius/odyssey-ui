import type { FC } from "react";
import * as SlideoutMenuDemos from "@/components/application/slideout-menus/slideout-menu.demo";

export default {
    title: "Application/Slideout menus",
    decorators: [
        (Story: FC) => (
            <div className="flex min-h-screen w-full items-center justify-center bg-primary p-8">
                <Story />
            </div>
        ),
    ],
};

export const Basic = () => <SlideoutMenuDemos.BasicDemo />;

export const WithForm = () => <SlideoutMenuDemos.WithFormDemo />;
