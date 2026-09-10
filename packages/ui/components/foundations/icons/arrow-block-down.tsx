import type { SVGProps } from "react";

interface Props extends SVGProps<SVGSVGElement> {
    color?: string;
    size?: number;
}

const ArrowBlockDown = ({ size = 24, color = "currentColor", ...props }: Props) => (
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
        <path d="M9 3.8c0-.28 0-.42.055-.527a.5.5 0 0 1 .218-.219C9.38 3 9.52 3 9.8 3h4.4c.28 0 .42 0 .527.054a.5.5 0 0 1 .218.219C15 3.38 15 3.52 15 3.8V14h4l-7 7-7-7h4V3.8Z" />
    </svg>
);

export default ArrowBlockDown;
