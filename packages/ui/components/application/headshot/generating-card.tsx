import type { ReactNode, Ref } from "react";
import { Badge } from "@/components/base/badges/badges";
import { cx } from "@/utils/cx";

// Collage positions: the face photo first, then two style references. Desktop: inside the 768px stage. Phone (max-md):
// Figma's re-arranged 390px collage, tiles at ~1.21x and beams at ~1.74x, partly off the card's sides.
const inputSlots = [
    {
        tile: "top-[87px] left-[18px] max-md:top-[37px] max-md:-left-[92px]",
        tag: "top-[166px] left-[18px] max-md:top-[134px] max-md:-left-[92px]",
        isPhoto: true,
    },
    {
        tile: "top-[119px] left-[106px] max-md:top-[71px] max-md:left-[15px] max-md:w-[97px]",
        tag: "top-[105px] left-[140px] w-[47px] justify-end max-md:top-[54px] max-md:left-[57px] max-md:w-[57px]",
    },
    { tile: "top-[204px] left-[47px] max-md:top-[180px] max-md:-left-[57px]", tag: "top-[191px] left-[47px] max-md:top-[164px] max-md:-left-[57px]" },
];

// The three output placeholders right of the logo (desktop, phone).
const outputSlots = [
    "top-[116px] left-[558px] max-md:top-[164px] max-md:left-[258px]",
    "top-[193px] left-[637px] max-md:top-[204px] max-md:left-[361px]",
    "top-[95px] left-[651px] max-md:top-[61px] max-md:left-[333px]",
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
    /** Progress stages (status chips), centred on the card's bottom border. The card reserves the space they hang below it. */
    stages?: ReactNode;
    className?: string;
}

/**
 * Illustrated "your headshots are being generated" card. The light beams pulse unless reduced motion is on.
 * Below `md` it switches to Figma's phone collage (340px tall, no captions, art bleeding 6px past the card's sides).
 */
export const GeneratingCard = ({ inputs, logo, captionLead = "Generating", captionTail = "Headshot", stages, className }: GeneratingCardProps) => (
    <div className={cx("relative h-[383px] w-full max-w-[768px] max-md:h-[340px]", stages && "mb-3 max-md:mb-[13px]", className)}>
        <div className="absolute inset-0 rounded-2xl border border-tertiary bg-primary" />
        {/* Desktop clips the art to the card; phones let it run 6px past the sides, to the screen edge like the board. */}
        <div className="absolute inset-px overflow-hidden rounded-[15px] max-md:-inset-x-1.5 max-md:inset-y-0 max-md:rounded-none">
            {/* Fixed stage (768px, phone 390px), centred so narrow screens crop the sides and keep the logo in view. */}
            <div className="absolute top-0 left-1/2 h-full w-[768px] -translate-x-1/2 max-md:w-[390px]">
                <p className="absolute top-[14px] left-3 text-xs/[15px] font-medium text-black max-md:hidden">
                    {captionLead} <span className="text-[#767676]">{captionTail}</span>
                </p>
                <p aria-hidden="true" className="absolute top-[356px] right-[11px] text-xs/[15px] font-medium text-black max-md:hidden">
                    <span className="text-[#767676]">{captionLead}</span> {captionTail}
                </p>

                {inputs.slice(0, 3).map((input, index) => {
                    const slot = inputSlots[index];
                    return (
                        <div key={index}>
                            <div
                                className={cx(
                                    "absolute flex h-[78px] w-[79px] items-center justify-center overflow-hidden rounded-lg bg-tertiary",
                                    // On phones Figma stacks the tiles over the beams.
                                    "max-md:z-1 max-md:h-[95px] max-md:w-[96px] max-md:rounded-[10px]",
                                    // Figma sets the phone references 15px from the top, not centred.
                                    !slot.isPhoto && "max-md:items-start max-md:pt-[15px]",
                                    slot.tile,
                                )}
                            >
                                <img
                                    src={input.src}
                                    alt={input.alt}
                                    className={
                                        slot.isPhoto
                                            ? "size-full object-cover"
                                            : "h-[58px] w-[59px] rounded-lg object-cover max-md:h-[71px] max-md:w-[72px] max-md:rounded-[10px]"
                                    }
                                />
                            </div>
                            <Badge
                                type="generating"
                                color={input.tone ?? "gray"}
                                className={cx("absolute max-md:z-1 max-md:px-1 max-md:text-[9px] max-md:leading-[11px]", slot.tag)}
                            >
                                {input.tag}
                            </Badge>
                        </div>
                    );
                })}

                <svg
                    aria-hidden="true"
                    viewBox="0 0 152 177"
                    className="absolute top-[99px] left-[185px] h-[177px] w-[152px] motion-safe:animate-pulse max-md:top-[23px] max-md:-left-[21px] max-md:h-[307px] max-md:w-[264px]"
                >
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

                <div className="absolute top-[139px] left-[330px] flex h-[94px] w-[80px] items-center justify-center rounded-[13px] border border-secondary max-md:top-[113px] max-md:left-[140px] max-md:z-1 max-md:h-[114px] max-md:w-[97px] max-md:rounded-2xl max-md:bg-primary">
                    <span className="flex max-md:scale-[1.21]">{logo}</span>
                </div>

                {/* Output placeholders, then the outgoing beam (Figma draws it mirrored). */}
                {outputSlots.map((slot) => (
                    <span
                        key={slot}
                        aria-hidden="true"
                        className={cx("absolute size-[81px] rounded-[14px] bg-secondary max-md:size-[95px] max-md:rounded-2xl", slot)}
                    />
                ))}
                <svg
                    aria-hidden="true"
                    viewBox="186 18 132 154"
                    className="absolute top-[113px] left-[414px] h-[154px] w-[132px] -scale-x-100 max-md:top-[46px] max-md:left-[154px] max-md:h-[267px] max-md:w-[229px]"
                >
                    <defs>
                        <linearGradient id="generating-beam-out" x1="318" x2="186" y1="0" y2="0" gradientUnits="userSpaceOnUse">
                            <stop stopColor="#141AC1" />
                            <stop offset="0.59" stopColor="#D16DD9" stopOpacity="0.62" />
                            <stop offset="1" stopColor="white" stopOpacity="0" />
                        </linearGradient>
                        <InnerGlow id="generating-beam-out-glow" blur={6} />
                    </defs>
                    <path
                        className="motion-safe:animate-pulse"
                        filter="url(#generating-beam-out-glow)"
                        fill="url(#generating-beam-out)"
                        d="M318 90.4308C316.834 90.4894 315.608 90.5259 314.325 90.5378C233.128 93.6977 194.981 148.324 186 172L186 18C220.224 77.0063 283.529 90.8245 314.325 90.5378C315.54 90.4905 316.765 90.4547 318 90.4308Z"
                    />
                </svg>
            </div>
        </div>
        {stages && <div className="absolute top-full left-1/2 -mt-3.5 -translate-x-1/2 max-md:-mt-[13px]">{stages}</div>}
        <Bracket className="-top-[3px] -left-[3.5px] -scale-x-100 max-md:-top-1.5 max-md:-left-0.5" />
        <Bracket className="-right-[3.5px] -bottom-[3px] rotate-90 max-md:-right-0.5 max-md:-bottom-1" />
    </div>
);

export interface GeneratingHeaderProps {
    /** Line breaks in a string title are kept ("Your Headshots\nare Ready!"). */
    title: ReactNode;
    description?: ReactNode;
    /** Usually the "Why this takes time" info pill. */
    children?: ReactNode;
    /** Heading level of the title; use 1 when it is the page's main heading. @default 2 */
    headingLevel?: 1 | 2 | 3 | 4 | 5 | 6;
    /** Put on the title heading, e.g. to label a region with it (`aria-labelledby`). */
    id?: string;
    /** Ref to the title heading, e.g. to move focus to it when the screen or its state changes (pair with `tabIndex={-1}`). */
    ref?: Ref<HTMLHeadingElement>;
    /** Put on the title heading; `-1` makes it focusable from script. */
    tabIndex?: number;
    className?: string;
}

/** Centred title block above the generating card. The title is 20px on phones, 24px from `md`. */
export const GeneratingHeader = ({ title, description, children, headingLevel = 2, id, ref, tabIndex, className }: GeneratingHeaderProps) => {
    const Heading = `h${headingLevel}` as const;
    return (
        <div className={cx("mx-auto flex w-full max-w-[292px] flex-col items-center gap-2.5 text-center", className)}>
            {/* A heading focused from script isn't a control, so it shows no focus ring. */}
            <Heading
                id={id}
                ref={ref}
                tabIndex={tabIndex}
                className="text-xl/[1.3] font-semibold whitespace-pre-line text-primary outline-hidden md:text-display-xs/[1.3]"
            >
                {title}
            </Heading>
            {/* Phones leave 12px (not 10) above the info pill. */}
            {description && <p className="text-sm leading-[1.3] font-medium text-subtle max-md:mb-0.5">{description}</p>}
            {children}
        </div>
    );
};
