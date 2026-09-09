import type { SVGProps } from "react";

interface Props extends SVGProps<SVGSVGElement> {
    color?: string;
    size?: number;
}

const Thermometer03 = ({ size = 24, color = "currentColor", ...props }: Props) => (
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
        <path d="M21 3h-6m6 4h-6m6 4h-6m-9.5 2.758V4.5a2.5 2.5 0 0 1 5 0v9.258a4.5 4.5 0 1 1-5 0ZM9 17.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z" />
    </svg>
);

export default Thermometer03;
