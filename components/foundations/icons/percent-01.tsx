import type { SVGProps } from "react";

interface Props extends SVGProps<SVGSVGElement> {
    color?: string;
    size?: number;
}

const Percent01 = ({ size = 24, color = "currentColor", ...props }: Props) => (
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
        <path d="M19 5 5 19M7.5 6.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0Zm11 11a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z" />
    </svg>
);

export default Percent01;
