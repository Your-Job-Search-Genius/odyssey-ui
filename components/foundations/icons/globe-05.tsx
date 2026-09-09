import type { SVGProps } from "react";

interface Props extends SVGProps<SVGSVGElement> {
    color?: string;
    size?: number;
}

const Globe05 = ({ size = 24, color = "currentColor", ...props }: Props) => (
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
        <path d="M15 2.458A9.996 9.996 0 0 0 12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10c0-1.715-.432-3.33-1.193-4.74M17 5.75h.005M10.5 21.888v-2.203a.5.5 0 0 1 .12-.325l2.486-2.9a.5.5 0 0 0-.131-.76l-2.857-1.632a.499.499 0 0 1-.186-.187L8.07 10.62a.5.5 0 0 0-.478-.25l-5.528.492M21 6c0 2.21-2 4-4 6-2-2-4-3.79-4-6a4 4 0 0 1 8 0Zm-3.75-.25a.25.25 0 1 1-.5 0 .25.25 0 0 1 .5 0Z" />
    </svg>
);

export default Globe05;
