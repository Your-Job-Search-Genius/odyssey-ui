import type { SVGProps } from "react";

interface Props extends SVGProps<SVGSVGElement> {
    color?: string;
    size?: number;
}

const CornerUpLeft = ({ size = 24, color = "currentColor", ...props }: Props) => (
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
        <path d="M9 14 4 9m0 0 5-5M4 9h6.4c3.36 0 5.04 0 6.324.654a6 6 0 0 1 2.622 2.622C20 13.56 20 15.24 20 18.6V20" />
    </svg>
);

export default CornerUpLeft;
