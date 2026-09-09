import type { SVGProps } from "react";

interface Props extends SVGProps<SVGSVGElement> {
    color?: string;
    size?: number;
}

const LogIn04 = ({ size = 24, color = "currentColor", ...props }: Props) => (
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
        <path d="m12 8 4 4m0 0-4 4m4-4H3m.338-5A9.996 9.996 0 0 1 12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10a9.996 9.996 0 0 1-8.662-5" />
    </svg>
);

export default LogIn04;
