"use client";

import type { ReactNode } from "react";
import type { Options as QRCodeStylingOptions } from "qr-code-styling";
import { CloseButton } from "@/components/base/buttons/close-button";
import { QRCode } from "@/components/shared-assets/qr-code";
import { cx } from "@/utils/cx";

// Module-level so `QRCode` (which re-appends on every options change) renders once.
const qrOptions: QRCodeStylingOptions = {
    width: 180,
    height: 180,
    margin: 0,
    backgroundOptions: { color: "transparent" },
    dotsOptions: { color: "#FFFFFF", type: "rounded" },
    cornersSquareOptions: { color: "#FFFFFF", type: "rounded" },
    cornersDotOptions: { color: "#FFFFFF", type: "rounded" },
};

export interface QRCardProps {
    /** The URL or text to encode. */
    value: string;
    /** Instruction above the code, e.g. "Use your phone to take the picture for a better quality". */
    caption: ReactNode;
    /** Shows the corner close button. Inside a Dialog/Popover the button also closes it. */
    onClose?: () => void;
    closeLabel?: string;
    className?: string;
}

/** Dark card with a white-on-black QR code for continuing on a phone. */
export const QRCard = ({ value, caption, onClose, closeLabel, className }: QRCardProps) => (
    <div className={cx("relative flex w-[230px] flex-col rounded-[20px] bg-[#4F4F4F]", className)}>
        <p className="mx-auto w-[180px] pt-[13px] pb-[9px] text-center text-sm leading-[18px] font-medium text-white">{caption}</p>
        <div className="h-[202px] rounded-[18px] bg-black/40 pt-3 pl-[23px]">
            {/* The shared QRCode draws decorative corner handles after the code; this card has none. */}
            <QRCode value={value} options={qrOptions} className="inline-flex p-0 [&>div~div]:hidden" />
        </div>
        {onClose && <CloseButton theme="white" label={closeLabel} onPress={onClose} className="absolute -top-[5px] -right-[7px]" />}
    </div>
);
