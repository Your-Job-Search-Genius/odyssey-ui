"use client";

import { useState } from "react";
import { Button } from "@/components/base/buttons/button";
import { FileTrigger } from "@/components/base/file-upload-trigger/file-upload-trigger";
import { Upload01 } from "@/components/foundations/icons";

export const BasicDemo = () => {
    const [fileName, setFileName] = useState<string | null>(null);

    return (
        <FileTrigger onSelect={(files) => setFileName(files?.[0]?.name ?? null)}>
            <Button iconLeading={Upload01} color="secondary">
                {fileName ?? "Upload file"}
            </Button>
        </FileTrigger>
    );
};

export const MultipleFilesDemo = () => {
    const [count, setCount] = useState<number | null>(null);

    return (
        <FileTrigger allowsMultiple onSelect={(files) => setCount(files?.length ?? null)}>
            <Button iconLeading={Upload01} color="secondary">
                {count ? `${count} file${count === 1 ? "" : "s"} selected` : "Upload files"}
            </Button>
        </FileTrigger>
    );
};

export const RestrictedFileTypesDemo = () => {
    const [fileName, setFileName] = useState<string | null>(null);

    return (
        <FileTrigger acceptedFileTypes={["image/png", "image/jpeg"]} onSelect={(files) => setFileName(files?.[0]?.name ?? null)}>
            <Button iconLeading={Upload01} color="secondary">
                {fileName ?? "Upload image (PNG or JPEG)"}
            </Button>
        </FileTrigger>
    );
};
