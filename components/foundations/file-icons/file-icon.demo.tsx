"use client";

import { FileIcon, SUPPORTED_FILE_TYPES } from "@/components/foundations/file-icons/file-icon";

export const DefaultDemo = () => {
    return (
        <div className="flex flex-wrap items-center gap-6">
            <FileIcon type="pdf" />
            <FileIcon type="docx" />
            <FileIcon type="xlsx" />
            <FileIcon type="pptx" />
            <FileIcon type="zip" />
            <FileIcon type="folder" />
        </div>
    );
};

export const VariantsDemo = () => {
    return (
        <div className="flex flex-col items-start gap-6">
            {(["default", "gray", "solid"] as const).map((variant) => (
                <div key={variant} className="flex items-center gap-4">
                    <span className="w-16 text-sm text-tertiary capitalize">{variant}</span>
                    <FileIcon type="pdf" variant={variant} />
                    <FileIcon type="docx" variant={variant} />
                    <FileIcon type="mp4" variant={variant} />
                    <FileIcon type="fig" variant={variant} />
                    <FileIcon type="zip" variant={variant} />
                </div>
            ))}
        </div>
    );
};

export const ThemeDemo = () => {
    return (
        <div className="flex gap-10">
            <div className="flex flex-col items-start gap-4 rounded-xl bg-primary p-6">
                <span className="text-sm text-tertiary">Light</span>
                <div className="flex gap-4">
                    <FileIcon type="pdf" theme="light" />
                    <FileIcon type="docx" theme="light" />
                    <FileIcon type="empty" theme="light" />
                </div>
            </div>
            <div className="flex flex-col items-start gap-4 rounded-xl bg-gray-950 p-6">
                <span className="text-sm text-white/60">Dark</span>
                <div className="flex gap-4">
                    <FileIcon type="pdf" theme="dark" />
                    <FileIcon type="docx" theme="dark" />
                    <FileIcon type="empty" theme="dark" />
                </div>
            </div>
        </div>
    );
};

export const SizesDemo = () => {
    return (
        <div className="flex items-end gap-4">
            {[16, 24, 32, 40, 56].map((size) => (
                <FileIcon key={size} type="pdf" size={size} />
            ))}
        </div>
    );
};

export const MimeTypeDemo = () => {
    return (
        <div className="flex flex-wrap items-center gap-6">
            <FileIcon type="application/pdf" />
            <FileIcon type="video/mp4" />
            <FileIcon type="audio/mpeg" />
            <FileIcon type="image/png" />
            <FileIcon type="text/html" />
            <FileIcon type="unknown/type" />
        </div>
    );
};

export const AllTypesDemo = () => {
    return (
        <div className="grid grid-cols-8 gap-6">
            {SUPPORTED_FILE_TYPES.map((type) => (
                <div key={type} className="flex flex-col items-center gap-2">
                    <FileIcon type={type} />
                    <span className="text-xs text-tertiary">{type}</span>
                </div>
            ))}
        </div>
    );
};
