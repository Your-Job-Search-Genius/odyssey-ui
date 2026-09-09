import type { SVGProps } from "react";

interface Props extends SVGProps<SVGSVGElement> {
    color?: string;
    size?: number;
}

const CornerUpRight = ({ size = 24, color = "currentColor", ...props }: Props) => (
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
        <path d="M4 20v-1.4c0-3.36 0-5.04.654-6.324a6 6 0 0 1 2.622-2.622C8.56 9 10.24 9 13.6 9H20m0 0-5 5m5-5-5-5" />
    </svg>
);

export default CornerUpRight;
