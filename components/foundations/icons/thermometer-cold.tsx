import type { SVGProps } from "react";

interface Props extends SVGProps<SVGSVGElement> {
    color?: string;
    size?: number;
}

const ThermometerCold = ({ size = 24, color = "currentColor", ...props }: Props) => (
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
        <path d="M2 12h10M9 4v16M3 9l3 3-3 3m9-9L9 9 6 6m0 12 3-3 1.5 1.5m9.5-1.965V4a2 2 0 1 0-4 0v10.535a4 4 0 1 0 4 0Z" />
    </svg>
);

export default ThermometerCold;
