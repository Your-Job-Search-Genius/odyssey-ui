import type { SVGProps } from "react";

interface Props extends SVGProps<SVGSVGElement> {
    color?: string;
    size?: number;
}

const SunSetting02 = ({ size = 24, color = "currentColor", ...props }: Props) => (
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
        <path d="M22 16.5H2M20 20H4m8-17v2m-8 8H2m4.314-5.686L4.9 5.9m12.786 1.414L19.1 5.9M22 13h-2M7 13a5 5 0 0 1 10 0" />
    </svg>
);

export default SunSetting02;
