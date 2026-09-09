import type { SVGProps } from "react";

interface Props extends SVGProps<SVGSVGElement> {
    color?: string;
    size?: number;
}

const MarkerPin06 = ({ size = 24, color = "currentColor", ...props }: Props) => (
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
        <path d="M16 13.374c3.532.695 6 2.28 6 4.126 0 2.485-4.477 4.5-10 4.5S2 19.985 2 17.5c0-1.845 2.468-3.431 6-4.126M12 17V9m0 0a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
    </svg>
);

export default MarkerPin06;
