import type { FC } from "react";
import * as IllustrationDemos from "@/components/shared-assets/illustrations/illustrations.demo";

export default {
    title: "Shared Assets/Illustrations",
    decorators: [
        (Story: FC) => (
            <div className="flex min-h-screen w-full items-center justify-center bg-primary p-8">
                <Story />
            </div>
        ),
    ],
};

export const Basic = () => <IllustrationDemos.BasicDemo />;

export const AllTypes = () => <IllustrationDemos.AllTypesDemo />;

export const Sizes = () => <IllustrationDemos.SizesDemo />;
