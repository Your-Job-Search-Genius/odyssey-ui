import type { FC } from "react";
import * as EmptyStateDemos from "@/components/application/empty-state/empty-state.demo";

export default {
    title: "Application/Empty state",
    decorators: [
        (Story: FC) => (
            <div className="flex min-h-screen w-full items-center justify-center bg-primary p-8">
                <Story />
            </div>
        ),
    ],
};

export const Basic = () => <EmptyStateDemos.BasicDemo />;

export const WithIllustration = () => <EmptyStateDemos.WithIllustrationDemo />;

export const WithAvatarRow = () => <EmptyStateDemos.WithAvatarRowDemo />;

export const Sizes = () => <EmptyStateDemos.SizesDemo />;

export const Licence = () => <EmptyStateDemos.LicenceDemo />;

export const Figma = () => (
    <div data-compare className="inline-flex flex-col items-start gap-4 bg-white p-0">
        <EmptyStateDemos.LicenceDemo />
    </div>
);
