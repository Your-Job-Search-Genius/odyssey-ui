import type { SVGProps } from "react";

interface Props extends SVGProps<SVGSVGElement> {
    color?: string;
    size?: number;
}

const LifeBuoy02 = ({ size = 24, color = "currentColor", ...props }: Props) => (
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
        <path d="M8.464 8.464 4.93 4.93m0 14.142 3.535-3.536m7.072 0 3.535 3.536m0-14.142-3.536 3.535M22 12c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2s10 4.477 10 10Zm-5 0a5 5 0 1 1-10 0 5 5 0 0 1 10 0Z" />
    </svg>
);

export default LifeBuoy02;
