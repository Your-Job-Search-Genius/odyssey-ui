import type { SVGProps } from "react";

interface Props extends SVGProps<SVGSVGElement> {
    color?: string;
    size?: number;
}

const Scissors02 = ({ size = 24, color = "currentColor", ...props }: Props) => (
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
        <path d="M4.5 8.6 21 17m0-10L4.5 15.4M6 3a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 12a3 3 0 1 1 0 6 3 3 0 0 1 0-6Z" />
    </svg>
);

export default Scissors02;
