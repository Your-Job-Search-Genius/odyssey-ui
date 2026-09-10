import type { SVGProps } from "react";

interface Props extends SVGProps<SVGSVGElement> {
    color?: string;
    size?: number;
}

const Wind02 = ({ size = 24, color = "currentColor", ...props }: Props) => (
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
        <path d="M9.51 4.667A2 2 0 1 1 11 8H2m10.51 11.333A2 2 0 1 0 14 16H2m14.764-9A3 3 0 1 1 19 12H2" />
    </svg>
);

export default Wind02;
