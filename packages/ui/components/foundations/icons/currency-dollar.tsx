import type { SVGProps } from "react";

interface Props extends SVGProps<SVGSVGElement> {
    color?: string;
    size?: number;
}

const CurrencyDollar = ({ size = 24, color = "currentColor", ...props }: Props) => (
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
        <path d="M6 16a4 4 0 0 0 4 4h4a4 4 0 0 0 0-8h-4a4 4 0 0 1 0-8h4a4 4 0 0 1 4 4m-6-6v20" />
    </svg>
);

export default CurrencyDollar;
