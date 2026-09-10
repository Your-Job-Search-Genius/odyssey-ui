import type { SVGProps } from "react";

interface Props extends SVGProps<SVGSVGElement> {
    color?: string;
    size?: number;
}

const CoinsStacked04 = ({ size = 24, color = "currentColor", ...props }: Props) => (
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
        <path d="M20 5c0 1.657-3.582 3-8 3S4 6.657 4 5m16 0c0-1.657-3.582-3-8-3S4 3.343 4 5m16 0v14c0 1.657-3.582 3-8 3s-8-1.343-8-3V5m16 4.667c0 1.656-3.582 3-8 3s-8-1.344-8-3m16 4.663c0 1.657-3.582 3-8 3s-8-1.343-8-3" />
    </svg>
);

export default CoinsStacked04;
