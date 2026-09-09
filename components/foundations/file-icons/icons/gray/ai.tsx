import type { SVGProps } from "react";

interface Props extends SVGProps<SVGSVGElement> {
    size?: number;
    theme?: "light" | "dark";
}

const Ai = ({ size = 40, theme = "light", ...props }: Props) => {
    return (
        <svg width={size} height={size} fill="none" viewBox="0 0 40 40" aria-hidden="true" {...props}>
            <mask id="ai_svg__b" width={32} height={40} x={4} y={0} maskUnits="userSpaceOnUse" style={{ maskType: "alpha" }}>
                <path fill="url(#ai_svg__a)" d="M4 4a4 4 0 0 1 4-4h16l12 12v24a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4z" />
            </mask>
            <g mask="url(#ai_svg__b)">
                <path fill={theme === "light" ? "#F5F5F5" : "#22262F"} d="M4 4a4 4 0 0 1 4-4h16l12 12v24a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4z" />
            </g>
            <path fill={theme === "light" ? "#E9EAEB" : "#373A41"} d="m24 0 12 12h-8a4 4 0 0 1-4-4z" />
            <path
                fill={theme === "light" ? "#414651" : "#CECFD2"}
                d="M17.07 32h-1.483l2.26-6.546h1.783L21.886 32h-1.483l-1.64-5.05h-.05zm-.093-2.573h3.503v1.08h-3.503zm7.08-3.972V32h-1.383v-6.546z"
            />
            <defs>
                <linearGradient id="ai_svg__a" x1={20} x2={20} y1={0} y2={40} gradientUnits="userSpaceOnUse">
                    <stop stopOpacity={0.4} />
                    <stop offset={1} />
                </linearGradient>
            </defs>
        </svg>
    );
};

export default Ai;
