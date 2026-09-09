import type { SVGProps } from "react";

interface Props extends SVGProps<SVGSVGElement> {
    color?: string;
    size?: number;
}

const Compass01 = ({ size = 24, color = "currentColor", ...props }: Props) => (
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
        <path d="M22 12c0 5.523-4.477 10-10 10m10-10c0-5.523-4.477-10-10-10m10 10h-2m-8 10C6.477 22 2 17.523 2 12m10 10v-2M2 12C2 6.477 6.477 2 12 2M2 12h2m8-10v2m7.071 15.071-1.414-1.414M6.343 6.343 4.93 4.93m12.728 1.414L19.07 4.93M4.93 19.07l1.414-1.414M8 12l2.5-1.5L12 8l1.5 2.5L16 12l-2.5 1.5L12 16l-1.5-2.5L8 12Z" />
    </svg>
);

export default Compass01;
