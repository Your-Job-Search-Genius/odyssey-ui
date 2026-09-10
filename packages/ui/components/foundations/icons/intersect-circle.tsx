import type { SVGProps } from "react";

interface Props extends SVGProps<SVGSVGElement> {
    color?: string;
    size?: number;
}

const IntersectCircle = ({ size = 24, color = "currentColor", ...props }: Props) => (
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
        <path d="M9 16A7 7 0 1 0 9 2a7 7 0 0 0 0 14Z" />
        <path d="M15 22a7 7 0 1 0 0-14 7 7 0 0 0 0 14Z" />
    </svg>
);

export default IntersectCircle;
