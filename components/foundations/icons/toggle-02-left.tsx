import type { SVGProps } from "react";

interface Props extends SVGProps<SVGSVGElement> {
    color?: string;
    size?: number;
}

const Toggle02Left = ({ size = 24, color = "currentColor", ...props }: Props) => (
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
        <path d="M10 16h8a4 4 0 0 0 0-8h-8m2 4a5 5 0 1 1-10 0 5 5 0 0 1 10 0Z" />
    </svg>
);

export default Toggle02Left;
