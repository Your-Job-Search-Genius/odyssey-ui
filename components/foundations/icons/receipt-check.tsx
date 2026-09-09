import type { SVGProps } from "react";

interface Props extends SVGProps<SVGSVGElement> {
    color?: string;
    size?: number;
}

const ReceiptCheck = ({ size = 24, color = "currentColor", ...props }: Props) => (
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
        <path d="m9 10.5 2 2L15.5 8M20 21V7.8c0-1.68 0-2.52-.327-3.162a3 3 0 0 0-1.311-1.311C17.72 3 16.88 3 15.2 3H8.8c-1.68 0-2.52 0-3.162.327a3 3 0 0 0-1.311 1.311C4 5.28 4 6.12 4 7.8V21l2.75-2 2.5 2L12 19l2.75 2 2.5-2L20 21Z" />
    </svg>
);

export default ReceiptCheck;
