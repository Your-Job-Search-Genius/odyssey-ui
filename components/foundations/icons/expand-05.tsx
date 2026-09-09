import type { SVGProps } from "react";

interface Props extends SVGProps<SVGSVGElement> {
    color?: string;
    size?: number;
}

const Expand05 = ({ size = 24, color = "currentColor", ...props }: Props) => (
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
        <path d="m15 9 6-6m0 0h-6m6 0v6M9 9 3 3m0 0v6m0-6h6m0 12-6 6m0 0h6m-6 0v-6m12 0 6 6m0 0v-6m0 6h-6" />
    </svg>
);

export default Expand05;
