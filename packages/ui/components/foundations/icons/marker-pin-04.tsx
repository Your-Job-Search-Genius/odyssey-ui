import type { SVGProps } from "react";

interface Props extends SVGProps<SVGSVGElement> {
    color?: string;
    size?: number;
}

const MarkerPin04 = ({ size = 24, color = "currentColor", ...props }: Props) => (
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
        <path d="M5 14.286c-1.851.817-3 1.955-3 3.214C2 19.985 6.477 22 12 22s10-2.015 10-4.5c0-1.259-1.149-2.397-3-3.214M18 8c0 4.064-4.5 6-6 9-1.5-3-6-4.936-6-9a6 6 0 1 1 12 0Zm-5 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z" />
    </svg>
);

export default MarkerPin04;
