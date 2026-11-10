import type { ReactNode } from "react";
import { cx } from "@/utils/cx";

const colors = {
    neutral: "text-white/20",
    good: "text-[#12B76A]",
    bad: "text-[#FA1D37]",
};

export interface FaceGuideRingProps {
    /** Ring colour. Decorative only: pair it with a visible heading that says what is wrong. @default "neutral" */
    status?: keyof typeof colors;
    /** The camera feed or photo (e.g. `<video className="size-full object-cover" />`); it is faded out at an oval edge. */
    children?: ReactNode;
    className?: string;
}

/** Dashed oval guide that frames the face in the selfie camera. */
export const FaceGuideRing = ({ status = "neutral", children, className }: FaceGuideRingProps) => (
    <div className={cx("relative h-[344px] w-[299px] shrink-0", className)}>
        {/* Figma masks the photo with an ellipse rx127 ry140 blurred by 13.5px; a soft radial mask is the CSS equivalent. */}
        <div className="absolute top-[5px] left-[-4.5px] h-[334px] w-[308px] overflow-hidden [mask-image:radial-gradient(127px_140px_at_50%_50%,#000_80%,transparent_120%)]">
            {children}
        </div>
        <svg aria-hidden="true" viewBox="0 0 299 344" fill="none" className={cx("absolute inset-0 size-full transition-colors duration-200", colors[status])}>
            <ellipse
                cx="149.5"
                cy="172"
                rx="145"
                ry="167.5"
                stroke="currentColor"
                strokeWidth="9"
                pathLength={232}
                strokeDasharray="1 1"
                strokeDashoffset="0.5"
            />
        </svg>
    </div>
);
