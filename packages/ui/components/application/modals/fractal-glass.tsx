import type { ComponentPropsWithRef } from "react";
import { cx } from "@/utils/cx";

/** Four soft colour blocks (two above, two mirrored below), each fading out and whitened at the edges. */
const blocks = [
    "-top-[165px] -left-[34px] h-[265px] w-[272px] bg-linear-to-b from-[#BAB9FF] opacity-40",
    "-top-[165px] left-[238px] h-[265px] w-[272px] bg-linear-to-b from-[#5D58FF] opacity-40",
    "top-[274px] -left-[35px] h-[122px] w-[273px] bg-linear-to-t from-[#F9E400]",
    "top-[274.5px] left-[238px] h-[121px] w-[272px] bg-linear-to-t from-[rgba(46,249,0,0.52)]",
];

/**
 * The splash modal's "fractal glass" hero art: colour blocks seen through 53px vertical glass stripes, fading
 * into the panel below. Pure CSS, decorative (`aria-hidden`). Absolutely positioned at the top of its nearest
 * positioned ancestor (e.g. a `Dialog`), 437px tall; put the modal's content below it.
 *
 * Figma blurs the blocks with a per-stripe background blur (70.5px). `backdrop-filter` renders unreliably
 * (not at all in headless Chrome, isolates the stripes' blend), so the blocks carry the blur themselves and
 * the opacity is tuned so the result matches the Figma render.
 */
export const FractalGlass = ({ className, ...props }: ComponentPropsWithRef<"div">) => (
    <div
        aria-hidden="true"
        {...props}
        className={cx(
            "pointer-events-none absolute inset-x-0 top-0 h-[437px] overflow-hidden bg-primary mask-[linear-gradient(to_bottom,black_12.6%,transparent_84.5%)]",
            className,
        )}
    >
        {blocks.map((block) => (
            <div
                key={block}
                className={cx(
                    "absolute rounded-[1px] border border-white/30 from-[47.84%] to-transparent to-[87.45%] shadow-[inset_0_0_44px_white] blur-[50px]",
                    block,
                )}
            />
        ))}

        {/* The fluted glass: each stripe's overlay gradient darkens one edge of the colour behind it. */}
        <div className="absolute -top-[22px] -left-[104px] flex h-[419px] w-[684px] overflow-hidden">
            {Array.from({ length: 13 }, (_, i) => (
                <div
                    key={i}
                    className="w-[53px] shrink-0 border-l-[1.4px] border-white/20 bg-linear-to-l from-white/20 via-[rgba(4,9,20,0.2)] via-31% to-white/20 to-[110.67%] mix-blend-overlay shadow-[inset_-1px_1px_1px_rgba(255,255,255,0.3)]"
                />
            ))}
        </div>
    </div>
);
