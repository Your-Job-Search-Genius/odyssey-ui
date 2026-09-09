import type { SVGProps } from "react";

interface Props extends SVGProps<SVGSVGElement> {
    color?: string;
    size?: number;
}

const Server02 = ({ size = 24, color = "currentColor", ...props }: Props) => (
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
        <path d="M6 8h.01M6 16h.01M6 12h12M6 12a4 4 0 0 1 0-8h12a4 4 0 0 1 0 8M6 12a4 4 0 0 0 0 8h12a4 4 0 0 0 0-8" />
    </svg>
);

export default Server02;
