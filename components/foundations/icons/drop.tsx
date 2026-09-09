import type { SVGProps } from "react";

interface Props extends SVGProps<SVGSVGElement> {
    color?: string;
    size?: number;
}

const Drop = ({ size = 24, color = "currentColor", ...props }: Props) => (
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
        <path d="M20 14a8 8 0 1 1-15.418-3C5.768 8.068 12 2 12 2s6.232 6.068 7.419 9A7.98 7.98 0 0 1 20 14Z" />
    </svg>
);

export default Drop;
