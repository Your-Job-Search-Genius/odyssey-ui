import type { SVGProps } from "react";

interface Props extends SVGProps<SVGSVGElement> {
    color?: string;
    size?: number;
}

const Sunrise = ({ size = 24, color = "currentColor", ...props }: Props) => (
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
        <path d="M4 18H2m4.314-5.686L4.9 10.9m12.786 1.414L19.1 10.9M22 18h-2M7 18a5 5 0 0 1 10 0m5 4H2M16 6l-4-4m0 0L8 6m4-4v7" />
    </svg>
);

export default Sunrise;
