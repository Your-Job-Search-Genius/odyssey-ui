import type { SVGProps } from "react";

interface Props extends SVGProps<SVGSVGElement> {
    color?: string;
    size?: number;
}

const Droplets03 = ({ size = 24, color = "currentColor", ...props }: Props) => (
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
        <path d="M12.56 6.08A10.97 10.97 0 0 0 14 2.5c.5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a6.98 6.98 0 0 1-11.91 4.97M7 15.78c2.2 0 4-1.83 4-4.05 0-1.16-.57-2.26-1.71-3.19-1.14-.93-2-2.31-2.29-3.76a6.585 6.585 0 0 1-2.29 3.76C3.56 9.46 3 10.58 3 11.73c0 2.22 1.8 4.05 4 4.05Z" />
    </svg>
);

export default Droplets03;
