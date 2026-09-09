import type { SVGProps } from "react";

interface Props extends SVGProps<SVGSVGElement> {
    color?: string;
    size?: number;
}

const Compass02 = ({ size = 24, color = "currentColor", ...props }: Props) => (
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
        <path d="M22 12h-2m2 0c0 5.523-4.477 10-10 10m10-10c0-5.523-4.477-10-10-10m7.071 17.071-1.414-1.414M4 12H2m0 0c0 5.523 4.477 10 10 10M2 12C2 6.477 6.477 2 12 2M6.343 6.343 4.93 4.93M12 4V2m5.657 4.343L19.07 4.93M12 22v-2m-7.071-.929 1.414-1.414M12 8l4 4-4 4-4-4 4-4Z" />
    </svg>
);

export default Compass02;
