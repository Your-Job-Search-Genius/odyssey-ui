import type { SVGProps } from "react";

interface Props extends SVGProps<SVGSVGElement> {
    color?: string;
    size?: number;
}

const CloudOff = ({ size = 24, color = "currentColor", ...props }: Props) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        {...props}
    >
        <path d="M21.7 16.118a4.5 4.5 0 0 0-3.78-6.099 6.002 6.002 0 0 0-7.22-4.878M7.287 7.286a5.973 5.973 0 0 0-1.207 2.733A4.5 4.5 0 0 0 6.5 19h11c.456 0 .896-.068 1.311-.194M3 3l18 18" />
    </svg>
);

export default CloudOff;
