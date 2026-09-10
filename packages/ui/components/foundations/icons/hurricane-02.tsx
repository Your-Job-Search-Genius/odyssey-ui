import type { SVGProps } from "react";

interface Props extends SVGProps<SVGSVGElement> {
    color?: string;
    size?: number;
}

const Hurricane02 = ({ size = 24, color = "currentColor", ...props }: Props) => (
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
        <path d="M18 12a6 6 0 0 1-12 0m12 0a6 6 0 0 0-12 0m12 0a8 8 0 1 1-16 0m4 0a8 8 0 1 1 16 0m-9 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z" />
    </svg>
);

export default Hurricane02;
