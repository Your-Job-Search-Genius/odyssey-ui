import type { SVGProps } from "react";

interface Props extends SVGProps<SVGSVGElement> {
    color?: string;
    size?: number;
}

const Minimize02 = ({ size = 24, color = "currentColor", ...props }: Props) => (
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
        <path d="M3 8h.2c1.68 0 2.52 0 3.162-.327a3 3 0 0 0 1.31-1.311C8 5.72 8 4.88 8 3.2V3M3 16h.2c1.68 0 2.52 0 3.162.327a3 3 0 0 1 1.31 1.311C8 18.28 8 19.12 8 20.8v.2m8-18v.2c0 1.68 0 2.52.327 3.162a3 3 0 0 0 1.31 1.311C18.28 8 19.12 8 20.8 8h.2m-5 13v-.2c0-1.68 0-2.52.327-3.162a3 3 0 0 1 1.31-1.311C18.28 16 19.12 16 20.8 16h.2" />
    </svg>
);

export default Minimize02;
