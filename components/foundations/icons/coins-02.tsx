import type { SVGProps } from "react";

interface Props extends SVGProps<SVGSVGElement> {
    color?: string;
    size?: number;
}

const Coins02 = ({ size = 24, color = "currentColor", ...props }: Props) => (
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
        <path d="M15.938 15.938A7.001 7.001 0 0 0 15 2a7.001 7.001 0 0 0-6.938 6.062M7.5 13 9 12v5.5m-1.5 0h3M16 15a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z" />
    </svg>
);

export default Coins02;
