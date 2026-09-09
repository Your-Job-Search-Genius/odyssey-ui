import type { SVGProps } from "react";

interface Props extends SVGProps<SVGSVGElement> {
    color?: string;
    size?: number;
}

const Underline02 = ({ size = 24, color = "currentColor", ...props }: Props) => (
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
        <path d="M19 4v6a7 7 0 1 1-14 0V4m3.5 0v6a7.003 7.003 0 0 0 5.14 6.75M4 21h16M3 4h7.5M17 4h4" />
    </svg>
);

export default Underline02;
