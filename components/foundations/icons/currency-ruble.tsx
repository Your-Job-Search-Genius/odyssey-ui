import type { SVGProps } from "react";

interface Props extends SVGProps<SVGSVGElement> {
    color?: string;
    size?: number;
}

const CurrencyRuble = ({ size = 24, color = "currentColor", ...props }: Props) => (
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
        <path d="M8.5 11.5h6a4 4 0 0 0 0-8h-6v8Zm0 0h-2m7 4h-7M8.5 4v16.5" />
    </svg>
);

export default CurrencyRuble;
