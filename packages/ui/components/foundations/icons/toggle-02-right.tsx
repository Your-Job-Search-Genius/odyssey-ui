import type { SVGProps } from "react";

interface Props extends SVGProps<SVGSVGElement> {
    color?: string;
    size?: number;
}

const Toggle02Right = ({ size = 24, color = "currentColor", ...props }: Props) => (
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
        <path d="M14 16H6a4 4 0 0 1 0-8h8m8 4a5 5 0 1 1-10 0 5 5 0 0 1 10 0Z" />
    </svg>
);

export default Toggle02Right;
