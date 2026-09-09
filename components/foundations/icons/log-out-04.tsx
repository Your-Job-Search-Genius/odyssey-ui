import type { SVGProps } from "react";

interface Props extends SVGProps<SVGSVGElement> {
    color?: string;
    size?: number;
}

const LogOut04 = ({ size = 24, color = "currentColor", ...props }: Props) => (
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
        <path d="m18 8 4 4m0 0-4 4m4-4H9m6-7.796A8.383 8.383 0 0 0 10.667 3C5.88 3 2 7.03 2 12s3.88 9 8.667 9A8.384 8.384 0 0 0 15 19.796" />
    </svg>
);

export default LogOut04;
