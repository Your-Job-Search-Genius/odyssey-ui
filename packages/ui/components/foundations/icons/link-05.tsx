import type { SVGProps } from "react";

interface Props extends SVGProps<SVGSVGElement> {
    color?: string;
    size?: number;
}

const Link05 = ({ size = 24, color = "currentColor", ...props }: Props) => (
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
        <path d="M9 17H7A5 5 0 0 1 7 7h2m-1 5h10m-2.222 5H17a5 5 0 0 0 0-10h-1.222a.778.778 0 0 0-.778.778v8.444c0 .43.348.778.778.778Z" />
    </svg>
);

export default Link05;
