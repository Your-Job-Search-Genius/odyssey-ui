import type { SVGProps } from "react";

interface Props extends SVGProps<SVGSVGElement> {
    color?: string;
    size?: number;
}

const Cryptocurrency03 = ({ size = 24, color = "currentColor", ...props }: Props) => (
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
        <path d="m2 2 2 2m18-2-2 2m2 18-2-2M2 22l2-2m-2-4h1.5M8 2v1.5M22 8h-1.5M16 22v-1.5m2-4.5h3.5M16 2v4M2 8h4m2 14v-4m8-6a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z" />
    </svg>
);

export default Cryptocurrency03;
