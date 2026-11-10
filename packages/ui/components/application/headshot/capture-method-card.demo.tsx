"use client";

import { FileUpload } from "@/components/application/file-upload/file-upload-base";
import { CaptureMethodCard, CapturePrivacyNote } from "@/components/application/headshot/capture-method-card";
import { ImageAdd01Icon, UserCircleIcon } from "@/components/foundations/hugeicons";

/** The face-scan mark from the design: brand corner brackets around a user glyph. */
export const FaceScanMark = () => (
    <span aria-hidden="true" className="relative block size-[46px]">
        <svg viewBox="0 0 40 40" className="absolute inset-[3px] size-10 text-brand-300">
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                fill="currentColor"
                d="M14.6391 1.81052C14.6912 2.8612 13.8817 3.75515 12.831 3.80722C8.88441 4.00282 7.04652 4.58687 5.8167 5.8167C4.58687 7.04652 4.00282 8.88441 3.80722 12.831C3.75515 13.8817 2.8612 14.6912 1.81052 14.6391C0.759838 14.5871 -0.049694 13.6931 0.00237765 12.6424C0.20321 8.59013 0.805076 5.44085 3.12296 3.12296C5.44085 0.805077 8.59012 0.203211 12.6424 0.00237765C13.6931 -0.049694 14.5871 0.759837 14.6391 1.81052ZM25.3609 1.81052C25.4129 0.759837 26.3069 -0.049694 27.3576 0.00237765C31.4099 0.20321 34.5592 0.805076 36.877 3.12296C39.1949 5.44085 39.7968 8.59013 39.9976 12.6424C40.0497 13.6931 39.2402 14.5871 38.1895 14.6391C37.1388 14.6912 36.2449 13.8817 36.1928 12.831C35.9972 8.88441 35.4131 7.04652 34.1833 5.8167C32.9535 4.58687 31.1156 4.00282 27.169 3.80722C26.1183 3.75515 25.3088 2.8612 25.3609 1.81052ZM1.81052 25.3609C2.8612 25.3088 3.75515 26.1183 3.80722 27.169C4.00282 31.1156 4.58687 32.9535 5.8167 34.1833C7.04652 35.4131 8.88441 35.9972 12.831 36.1928C13.8817 36.2449 14.6912 37.1388 14.6391 38.1895C14.5871 39.2402 13.6931 40.0497 12.6424 39.9976C8.59012 39.7968 5.44084 39.1949 3.12296 36.877C0.805076 34.5592 0.20321 31.4099 0.00237765 27.3576C-0.049694 26.3069 0.759837 25.4129 1.81052 25.3609ZM38.1895 25.3609C39.2402 25.4129 40.0497 26.3069 39.9976 27.3576C39.7968 31.4099 39.1949 34.5592 36.877 36.877C34.5592 39.1949 31.4099 39.7968 27.3576 39.9976C26.3069 40.0497 25.4129 39.2402 25.3609 38.1895C25.3088 37.1388 26.1183 36.2449 27.169 36.1928C31.1156 35.9972 32.9535 35.4131 34.1833 34.1833C35.4131 32.9535 35.9972 31.1156 36.1928 27.169C36.2449 26.1183 37.1388 25.3088 38.1895 25.3609Z"
            />
        </svg>
        <UserCircleIcon className="absolute top-3 left-3 size-[23px] text-fg-primary" />
    </span>
);

export const CaptureMethodsDemo = () => (
    <div className="flex w-full max-w-[393px] flex-col gap-2.5">
        <CaptureMethodCard
            tab="Recommended"
            icon={<FaceScanMark />}
            title="Computer Webcam"
            description="See your framing and get guidance before every shot"
            onPress={() => {}}
        />
        <CaptureMethodCard layout="compact" title="Use Phone Camera" description="Scan a code to capture or upload with a better camera." onPress={() => {}} />
        <FileUpload.DropZone
            icon={ImageAdd01Icon}
            title="Upload Photos"
            hint="Choose up to 5 photos to get started. Accepted format are JPG, PNG or HEIC files."
            accept="image/jpeg,image/png,image/heic"
            onDropFiles={() => {}}
        />
    </div>
);

export const PrivacyNoteDemo = () => <CapturePrivacyNote>Photos stay private, encrypted in transit, and never used for ads</CapturePrivacyNote>;
