import type { SVGProps } from "react";

interface Props extends SVGProps<SVGSVGElement> {
    size?: number;
    theme?: "light" | "dark";
}

const Empty = ({ size = 40, theme = "light", ...props }: Props) => {
    return (
        <svg width={size} height={size} fill="none" viewBox="0 0 40 40" aria-hidden="true" {...props}>
            <mask id="empty_svg__b" width={32} height={40} x={4} y={0} maskUnits="userSpaceOnUse" style={{ maskType: "alpha" }}>
                <path fill="url(#empty_svg__a)" d="M4 4a4 4 0 0 1 4-4h16l12 12v24a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4z" />
            </mask>
            <g mask="url(#empty_svg__b)">
                <path fill={theme === "light" ? "#F5F5F5" : "#22262F"} d="M4 4a4 4 0 0 1 4-4h16l12 12v24a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4z" />
            </g>
            <path fill={theme === "light" ? "#E9EAEB" : "#373A41"} d="m24 0 12 12h-8a4 4 0 0 1-4-4z" />
            <defs>
                <linearGradient id="empty_svg__a" x1={20} x2={20} y1={0} y2={40} gradientUnits="userSpaceOnUse">
                    <stop stopOpacity={0.4} />
                    <stop offset={1} />
                </linearGradient>
            </defs>
        </svg>
    );
};

export default Empty;
