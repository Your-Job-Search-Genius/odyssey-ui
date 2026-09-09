import type { SVGProps } from "react";

interface Props extends SVGProps<SVGSVGElement> {
    color?: string;
    size?: number;
}

const RefreshCcw05 = ({ size = 24, color = "currentColor", ...props }: Props) => (
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
        <path d="M8.547 19.767A8.5 8.5 0 0 0 19.362 7.75l-.25-.433M4.638 16.25A8.5 8.5 0 0 1 15.453 4.233m-12.96 12.1 2.732.733.733-2.732m12.085-4.668.732-2.732 2.732.732" />
    </svg>
);

export default RefreshCcw05;
