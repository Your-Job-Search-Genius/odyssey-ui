import type { SVGProps } from "react";

interface Props extends SVGProps<SVGSVGElement> {
    color?: string;
    size?: number;
}

const ArrowCircleBrokenUpRight = ({ size = 24, color = "currentColor", ...props }: Props) => (
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
        <path d="M2.34 14.59a9.996 9.996 0 0 1 2.589-9.661c3.905-3.905 10.237-3.905 14.142 0 3.905 3.905 3.905 10.237 0 14.142a9.996 9.996 0 0 1-9.66 2.59M15 15V9m0 0H9m6 0L5 19" />
    </svg>
);

export default ArrowCircleBrokenUpRight;
