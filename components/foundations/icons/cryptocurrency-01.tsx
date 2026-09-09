import type { SVGProps } from "react";

interface Props extends SVGProps<SVGSVGElement> {
    color?: string;
    size?: number;
}

const Cryptocurrency01 = ({ size = 24, color = "currentColor", ...props }: Props) => (
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
        <path d="M17.878 20.09a10 10 0 0 1-11.756 0M16.384 3.012a10 10 0 0 1 5.519 10.38m-19.806 0a10 10 0 0 1 5.52-10.38M17.5 12a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0Z" />
    </svg>
);

export default Cryptocurrency01;
