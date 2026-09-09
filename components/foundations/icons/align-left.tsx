import type { SVGProps } from "react";

interface Props extends SVGProps<SVGSVGElement> {
    color?: string;
    size?: number;
}

const AlignLeft = ({ size = 24, color = "currentColor", ...props }: Props) => (
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
        <path d="M16 10H3m17-4H3m17 8H3m13 4H3" />
    </svg>
);

export default AlignLeft;
