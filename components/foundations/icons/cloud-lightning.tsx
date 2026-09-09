import type { SVGProps } from "react";

interface Props extends SVGProps<SVGSVGElement> {
    color?: string;
    size?: number;
}

const CloudLightning = ({ size = 24, color = "currentColor", ...props }: Props) => (
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
        <path d="M19 15.744a4.502 4.502 0 0 0-1.08-8.725 6.002 6.002 0 0 0-11.84 0A4.5 4.5 0 0 0 5 15.744M13 10l-4 6h6l-4 6" />
    </svg>
);

export default CloudLightning;
