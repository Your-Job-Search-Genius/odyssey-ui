import type { SVGProps } from "react";

interface Props extends SVGProps<SVGSVGElement> {
    size?: number;
    theme?: "light" | "dark";
}

const Txt = ({ size = 40, theme = "light", ...props }: Props) => {
    return (
        <svg width={size} height={size} fill="none" viewBox="0 0 40 40" aria-hidden="true" {...props}>
            <mask id="txt_svg__b" width={32} height={40} x={4} y={0} maskUnits="userSpaceOnUse" style={{ maskType: "alpha" }}>
                <path fill="url(#txt_svg__a)" d="M4 4a4 4 0 0 1 4-4h16l12 12v24a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4z" />
            </mask>
            <g mask="url(#txt_svg__b)">
                <path fill={theme === "light" ? "#F5F5F5" : "#22262F"} d="M4 4a4 4 0 0 1 4-4h16l12 12v24a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4z" />
            </g>
            <path fill={theme === "light" ? "#E9EAEB" : "#373A41"} d="m24 0 12 12h-8a4 4 0 0 1-4-4z" />
            <path
                fill={theme === "light" ? "#414651" : "#CECFD2"}
                d="M11.091 26.596v-1.142h5.376v1.142h-2.004V32h-1.368v-5.404zm7.559-1.142 1.32 2.231h.05l1.327-2.23h1.563l-1.997 3.272L22.955 32h-1.592l-1.342-2.234h-.051L18.627 32h-1.585l2.049-3.273-2.01-3.273zm4.886 1.142v-1.142h5.376v1.142h-2.004V32H25.54v-5.404z"
            />
            <defs>
                <linearGradient id="txt_svg__a" x1={20} x2={20} y1={0} y2={40} gradientUnits="userSpaceOnUse">
                    <stop stopOpacity={0.4} />
                    <stop offset={1} />
                </linearGradient>
            </defs>
        </svg>
    );
};

export default Txt;
