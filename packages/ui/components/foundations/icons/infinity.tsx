import type { SVGProps } from "react";

interface Props extends SVGProps<SVGSVGElement> {
    color?: string;
    size?: number;
}

const Infinity = ({ size = 24, color = "currentColor", ...props }: Props) => (
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
        <path d="M18.178 8c5.096 0 5.096 8 0 8-5.095 0-7.133-8-12.74-8-4.584 0-4.584 8 0 8 5.607 0 7.645-8 12.74-8h0Z" />
    </svg>
);

export default Infinity;
