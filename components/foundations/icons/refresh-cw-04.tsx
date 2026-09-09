import type { SVGProps } from "react";

interface Props extends SVGProps<SVGSVGElement> {
    color?: string;
    size?: number;
}

const RefreshCw04 = ({ size = 24, color = "currentColor", ...props }: Props) => (
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
        <path d="M17 5.125A8.5 8.5 0 0 1 12 20.5h-.5M7 18.875A8.5 8.5 0 0 1 12 3.5h.5m.5 18.9-2-2 2-2M11 5.6l2-2-2-2" />
    </svg>
);

export default RefreshCw04;
