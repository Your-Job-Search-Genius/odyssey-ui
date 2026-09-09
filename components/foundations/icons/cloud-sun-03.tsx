import type { SVGProps } from "react";

interface Props extends SVGProps<SVGSVGElement> {
    color?: string;
    size?: number;
}

const CloudSun03 = ({ size = 24, color = "currentColor", ...props }: Props) => (
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
        <path d="M3.15 11a7.5 7.5 0 1 1 14.784-2.5M6 22a4 4 0 1 1 .337-7.986 6.003 6.003 0 0 1 10.866-1.004A4.5 4.5 0 1 1 17.5 22H6Z" />
    </svg>
);

export default CloudSun03;
