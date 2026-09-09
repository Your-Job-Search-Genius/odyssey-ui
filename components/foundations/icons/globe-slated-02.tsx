import type { SVGProps } from "react";

interface Props extends SVGProps<SVGSVGElement> {
    color?: string;
    size?: number;
}

const GlobeSlated02 = ({ size = 24, color = "currentColor", ...props }: Props) => (
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
        <path d="m2.661 18.34 4.594-4.595M18.218 2.783A9.5 9.5 0 1 1 4.783 16.218M17 22H7m5 0v-3m5.5-9.5a6 6 0 1 1-12 0 6 6 0 0 1 12 0Z" />
    </svg>
);

export default GlobeSlated02;
