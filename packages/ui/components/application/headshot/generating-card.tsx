import type { ReactNode } from "react";
import { Badge } from "@/components/base/badges/badges";
import { cx } from "@/utils/cx";

// Collage positions inside the 768px stage: the face photo first, then two style references.
const inputSlots = [
    { tile: "top-[87px] left-[18px]", tag: "top-[166px] left-[18px]", isPhoto: true },
    { tile: "top-[119px] left-[106px]", tag: "top-[105px] left-[140px] w-[47px] justify-end" },
    { tile: "top-[204px] left-[47px]", tag: "top-[191px] left-[47px]" },
];

// Figma's white inner shadow (blur = stdDeviation), which softens the beams and brackets.
const InnerGlow = ({ id, blur }: { id: string; blur: number }) => (
    <filter id={id} colorInterpolationFilters="sRGB">
        <feColorMatrix in="SourceAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
        <feGaussianBlur stdDeviation={blur} />
        <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
        <feColorMatrix values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 1 0" />
        <feBlend in2="SourceGraphic" />
    </filter>
);

const Bracket = ({ className }: { className: string }) => (
    <svg aria-hidden="true" viewBox="0 0 29 29" className={cx("absolute size-[29px] fill-[#01EA6E]", className)}>
        <InnerGlow id="generating-bracket-glow" blur={2} />
        <path
            filter="url(#generating-bracket-glow)"
            d="M0.005 3.586C0.108 1.505 1.878-0.098 3.96 0.005C11.986 0.402 18.223 1.595 22.814 6.186C27.405 10.777 28.598 17.014 28.995 25.041C29.098 27.122 27.495 28.892 25.414 28.995C23.333 29.098 21.562 27.495 21.459 25.414C21.072 17.597 19.915 13.957 17.479 11.521C15.043 9.085 11.403 7.928 3.586 7.541C1.505 7.438-0.098 5.667 0.005 3.586Z"
        />
    </svg>
);

export interface GeneratingInput {
    src: string;
    alt: string;
    tag: string;
    /** Tag colour. @default "gray" */
    tone?: "gray" | "purple" | "sky";
}

export interface GeneratingCardProps {
    /** Up to three inputs: the face photo, then two style references (cut-outs on a grey tile). */
    inputs: GeneratingInput[];
    /** Product mark shown in the centre tile. */
    logo?: ReactNode;
    /** Caption pair shown in two corners, e.g. "Generating" + "Headshot". */
    captionLead?: string;
    captionTail?: string;
    /** Progress stages (status chips) shown at the bottom of the card. */
    stages?: ReactNode;
    className?: string;
}

/** Illustrated "your headshots are being generated" card. The light beams pulse unless reduced motion is on. */
export const GeneratingCard = ({ inputs, logo, captionLead = "Generating", captionTail = "Headshot", stages, className }: GeneratingCardProps) => (
    <div className={cx("relative h-[383px] w-full max-w-[768px]", className)}>
        <div className="absolute inset-0 overflow-hidden rounded-2xl border border-tertiary bg-primary">
            {/* Fixed 768px stage, centred so narrow screens crop the sides and keep the logo in view. */}
            <div className="absolute top-0 left-1/2 h-full w-[768px] -translate-x-1/2">
                <p className="absolute top-[14px] left-3 text-xs/[15px] font-medium text-black">
                    {captionLead} <span className="text-[#767676]">{captionTail}</span>
                </p>
                <p aria-hidden="true" className="absolute top-[356px] right-[11px] text-xs/[15px] font-medium text-black">
                    <span className="text-[#767676]">{captionLead}</span> {captionTail}
                </p>

                {inputs.slice(0, 3).map((input, index) => {
                    const slot = inputSlots[index];
                    return (
                        <div key={index}>
                            <div
                                className={cx("absolute flex h-[78px] w-[79px] items-center justify-center overflow-hidden rounded-lg bg-tertiary", slot.tile)}
                            >
                                <img
                                    src={input.src}
                                    alt={input.alt}
                                    className={slot.isPhoto ? "size-full object-cover" : "h-[58px] w-[59px] rounded-lg object-cover"}
                                />
                            </div>
                            <Badge type="generating" color={input.tone ?? "gray"} className={cx("absolute", slot.tag)}>
                                {input.tag}
                            </Badge>
                        </div>
                    );
                })}

                <svg aria-hidden="true" viewBox="0 0 152 177" className="absolute top-[99px] left-[185px] h-[177px] w-[152px] motion-safe:animate-pulse">
                    <defs>
                        <linearGradient id="generating-beam-in" x1="152" x2="0" y1="0" y2="0" gradientUnits="userSpaceOnUse">
                            <stop stopColor="#3CC114" />
                            <stop offset="0.51" stopColor="#6DD9D0" stopOpacity="0.62" />
                            <stop offset="1" stopColor="white" stopOpacity="0" />
                        </linearGradient>
                        <InnerGlow id="generating-beam-in-glow" blur={6.5} />
                    </defs>
                    <path
                        opacity="0.5"
                        filter="url(#generating-beam-in-glow)"
                        fill="url(#generating-beam-in)"
                        d="M152 83.2484C150.658 83.3158 149.245 83.3576 147.768 83.3714C54.2683 87.0032 10.3415 149.788 0.000145514 177L0 0C39.4097 67.8189 112.306 83.7009 147.768 83.3714C149.167 83.317 150.578 83.2759 152 83.2484Z"
                    />
                </svg>

                <div className="absolute top-[139px] left-[330px] flex h-[94px] w-[80px] items-center justify-center rounded-[13px] border border-secondary">
                    {logo}
                </div>

                {/* Output placeholders and the outgoing beam (Figma draws them mirrored). */}
                <svg aria-hidden="true" viewBox="0 0 318 179" className="absolute top-[95px] left-[414px] h-[179px] w-[318px] -scale-x-100">
                    <defs>
                        <linearGradient id="generating-beam-out" x1="318" x2="186" y1="0" y2="0" gradientUnits="userSpaceOnUse">
                            <stop stopColor="#141AC1" />
                            <stop offset="0.59" stopColor="#D16DD9" stopOpacity="0.62" />
                            <stop offset="1" stopColor="white" stopOpacity="0" />
                        </linearGradient>
                        <InnerGlow id="generating-beam-out-glow" blur={6} />
                    </defs>
                    <g className="fill-bg-secondary">
                        <rect x="93" y="21" width="81" height="81" rx="14" />
                        <rect x="14" y="98" width="81" height="81" rx="14" />
                        <rect width="81" height="81" rx="14" />
                    </g>
                    <path
                        className="motion-safe:animate-pulse"
                        filter="url(#generating-beam-out-glow)"
                        fill="url(#generating-beam-out)"
                        d="M318 90.4308C316.834 90.4894 315.608 90.5259 314.325 90.5378C233.128 93.6977 194.981 148.324 186 172L186 18C220.224 77.0063 283.529 90.8245 314.325 90.5378C315.54 90.4905 316.765 90.4547 318 90.4308Z"
                    />
                </svg>

                {stages && <div className="absolute bottom-[18px] left-1/2 -translate-x-1/2">{stages}</div>}
            </div>
        </div>
        <Bracket className="-top-[3px] -left-[3.5px] -scale-x-100" />
        <Bracket className="-right-[3.5px] -bottom-[3px] rotate-90" />
    </div>
);

export interface GeneratingHeaderProps {
    title: ReactNode;
    description?: ReactNode;
    /** Usually the "Why this takes time" info pill. */
    children?: ReactNode;
    className?: string;
}

/** Centred title block above the generating card. */
export const GeneratingHeader = ({ title, description, children, className }: GeneratingHeaderProps) => (
    <div className={cx("mx-auto flex w-full max-w-[292px] flex-col items-center gap-2.5 text-center", className)}>
        <h2 className="text-display-xs leading-[1.3] font-semibold whitespace-nowrap text-primary">{title}</h2>
        {description && <p className="text-sm leading-[1.3] font-medium text-subtle">{description}</p>}
        {children}
    </div>
);
