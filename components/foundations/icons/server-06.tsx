import type { SVGProps } from "react";

interface Props extends SVGProps<SVGSVGElement> {
    color?: string;
    size?: number;
}

const Server06 = ({ size = 24, color = "currentColor", ...props }: Props) => (
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
        <path d="M20 12a8 8 0 0 1-8 8m8-8a8 8 0 0 0-8-8m8 8H4m8 8a8 8 0 0 1-8-8m8 8a12.24 12.24 0 0 0 3.2-8A12.24 12.24 0 0 0 12 4m0 16a12.24 12.24 0 0 1-3.2-8A12.24 12.24 0 0 1 12 4m-8 8a8 8 0 0 1 8-8M6 20a2 2 0 1 1-4 0 2 2 0 0 1 4 0Zm16 0a2 2 0 1 1-4 0 2 2 0 0 1 4 0ZM6 4a2 2 0 1 1-4 0 2 2 0 0 1 4 0Zm16 0a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z" />
    </svg>
);

export default Server06;
