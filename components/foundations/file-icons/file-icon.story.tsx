import type { FC } from "react";
import * as Demos from "./file-icon.demo";

export default {
    title: "Foundations/File Icons",
    decorators: [
        (Story: FC) => (
            <div className="flex min-h-screen w-full overflow-auto bg-primary p-8">
                <Story />
            </div>
        ),
    ],
};

export const Default = () => <Demos.DefaultDemo />;

export const Variants = () => <Demos.VariantsDemo />;

export const Theme = () => <Demos.ThemeDemo />;

export const Sizes = () => <Demos.SizesDemo />;

export const MimeType = () => <Demos.MimeTypeDemo />;

export const AllTypes = () => <Demos.AllTypesDemo />;
