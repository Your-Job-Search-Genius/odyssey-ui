import type { SVGProps } from "react";

interface Props extends SVGProps<SVGSVGElement> {
    color?: string;
    size?: number;
}

const CloudRaining06 = ({ size = 24, color = "currentColor", ...props }: Props) => (
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
        <path d="M13 21H6m13-3h-9m-3 0H5m13 3h-2m-9-6a5 5 0 1 1 .1-9.999 5.502 5.502 0 0 1 10.195 1.004A4.5 4.5 0 1 1 17.5 15H6.999Z" />
    </svg>
);

export default CloudRaining06;
