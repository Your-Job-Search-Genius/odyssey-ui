import type { SVGProps } from "react";

interface Props extends SVGProps<SVGSVGElement> {
    color?: string;
    size?: number;
}

const Webcam02 = ({ size = 24, color = "currentColor", ...props }: Props) => (
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
        <path d="M8 22h8m4.5-11.5a8.5 8.5 0 1 1-17 0 8.5 8.5 0 0 1 17 0Zm-5.313 0a3.188 3.188 0 1 1-6.375 0 3.188 3.188 0 0 1 6.376 0Z" />
    </svg>
);

export default Webcam02;
