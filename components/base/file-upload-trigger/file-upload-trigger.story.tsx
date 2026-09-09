import type { FC } from "react";
import * as FileUploadTriggerDemos from "@/components/base/file-upload-trigger/file-upload-trigger.demo";

export default {
    title: "Base components/File upload trigger",
    decorators: [
        (Story: FC) => (
            <div className="flex min-h-screen w-full items-center justify-center bg-primary p-8">
                <Story />
            </div>
        ),
    ],
};

export const Basic = () => <FileUploadTriggerDemos.BasicDemo />;

export const MultipleFiles = () => <FileUploadTriggerDemos.MultipleFilesDemo />;

export const RestrictedFileTypes = () => <FileUploadTriggerDemos.RestrictedFileTypesDemo />;
