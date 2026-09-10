import type { SVGProps } from "react";

interface Props extends SVGProps<SVGSVGElement> {
    color?: string;
    size?: number;
}

const Airpods = ({ size = 24, color = "currentColor", ...props }: Props) => (
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
        <path d="M2 7.625a4.125 4.125 0 0 0 4.125 4.125c.306 0 .459 0 .538.027a.445.445 0 0 1 .31.31c.027.08.027.203.027.452v6.336a1.625 1.625 0 1 0 3.25 0V7.625a4.125 4.125 0 0 0-8.25 0Zm20 0a4.125 4.125 0 0 1-4.125 4.125c-.306 0-.459 0-.538.027a.445.445 0 0 0-.31.31c-.027.08-.027.203-.027.452v6.336a1.625 1.625 0 1 1-3.25 0V7.625a4.125 4.125 0 1 1 8.25 0Z" />
    </svg>
);

export default Airpods;
