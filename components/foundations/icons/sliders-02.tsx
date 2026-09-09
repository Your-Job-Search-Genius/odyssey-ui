import type { SVGProps } from "react";

interface Props extends SVGProps<SVGSVGElement> {
    color?: string;
    size?: number;
}

const Sliders02 = ({ size = 24, color = "currentColor", ...props }: Props) => (
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
        <path d="M5 21v-6m0 0a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm0-8V3m7 18v-6m0-8V3m0 4a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm7 14v-4m0 0a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm0-8V3" />
    </svg>
);

export default Sliders02;
