import type { SVGProps } from "react";

interface Props extends SVGProps<SVGSVGElement> {
    color?: string;
    size?: number;
}

const ArrowCircleBrokenDownRight = ({ size = 24, color = "currentColor", ...props }: Props) => (
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
        <path d="M9.41 2.34a9.996 9.996 0 0 1 9.661 2.589c3.905 3.905 3.905 10.237 0 14.142-3.905 3.905-10.237 3.905-14.142 0a9.996 9.996 0 0 1-2.59-9.66M15 9v6m0 0H9m6 0L5 5" />
    </svg>
);

export default ArrowCircleBrokenDownRight;
