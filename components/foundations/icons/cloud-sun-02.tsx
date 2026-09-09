import type { SVGProps } from "react";

interface Props extends SVGProps<SVGSVGElement> {
    color?: string;
    size?: number;
}

const CloudSun02 = ({ size = 24, color = "currentColor", ...props }: Props) => (
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
        <path d="M10.5 1.5v1.6M3.6 10H2m3.451-5.049L4.32 3.82m11.23 1.131 1.13-1.131M19 10h-1.6M6.5 10A4 4 0 0 1 14 8.062M6 22a4 4 0 1 1 1.324-7.775 5.002 5.002 0 0 1 9.352 0A4 4 0 1 1 18 22H6Z" />
    </svg>
);

export default CloudSun02;
