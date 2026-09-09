import type { SVGProps } from "react";

interface Props extends SVGProps<SVGSVGElement> {
    color?: string;
    size?: number;
}

const Share01 = ({ size = 24, color = "currentColor", ...props }: Props) => (
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
        <path d="M21 12v4.2c0 1.68 0 2.52-.327 3.162a3 3 0 0 1-1.311 1.311C18.72 21 17.88 21 16.2 21H7.8c-1.68 0-2.52 0-3.162-.327a3 3 0 0 1-1.311-1.311C3 18.72 3 17.88 3 16.2V12m13-5-4-4m0 0L8 7m4-4v12" />
    </svg>
);

export default Share01;
