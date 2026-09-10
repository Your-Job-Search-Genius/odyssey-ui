import type { SVGProps } from "react";

interface Props extends SVGProps<SVGSVGElement> {
    color?: string;
    size?: number;
}

const Webcam01 = ({ size = 24, color = "currentColor", ...props }: Props) => (
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
        <path d="M12 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm0 0v4m0 0H7m5 0h5m-2-12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
    </svg>
);

export default Webcam01;
