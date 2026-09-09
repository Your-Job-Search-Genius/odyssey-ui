import type { SVGProps } from "react";

interface Props extends SVGProps<SVGSVGElement> {
    color?: string;
    size?: number;
}

const MarkerPin03 = ({ size = 24, color = "currentColor", ...props }: Props) => (
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
        <path d="M12 22c1-5 8-5.582 8-12a8 8 0 1 0-16 0c0 6.418 7 7 8 12Z" />
        <path d="M12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
    </svg>
);

export default MarkerPin03;
