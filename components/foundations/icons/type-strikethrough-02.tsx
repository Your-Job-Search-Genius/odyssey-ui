import type { SVGProps } from "react";

interface Props extends SVGProps<SVGSVGElement> {
    color?: string;
    size?: number;
}

const TypeStrikethrough02 = ({ size = 24, color = "currentColor", ...props }: Props) => (
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
        <path d="M8 20h8m-5.75-9.5V20m3.5-6v6M3 3l18 18M4 7V6c0-.541.215-1.032.564-1.392M9.5 4H17c.932 0 1.398 0 1.765.152a2 2 0 0 1 1.083 1.083C20 5.602 20 6.068 20 7m-9.75-3v1m3.5-1v4" />
    </svg>
);

export default TypeStrikethrough02;
