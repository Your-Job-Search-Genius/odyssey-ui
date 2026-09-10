import type { SVGProps } from "react";

interface Props extends SVGProps<SVGSVGElement> {
    color?: string;
    size?: number;
}

const Moon02 = ({ size = 24, color = "currentColor", ...props }: Props) => (
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
        <path d="M21.955 12.956a8 8 0 1 1-10.91-10.911C5.97 2.526 2 6.799 2 12c0 5.523 4.477 10 10 10 5.2 0 9.473-3.97 9.955-9.044Z" />
    </svg>
);

export default Moon02;
