import type { SVGProps } from "react";

interface Props extends SVGProps<SVGSVGElement> {
    color?: string;
    size?: number;
}

const ClockPlus = ({ size = 24, color = "currentColor", ...props }: Props) => (
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
        <path d="M21.92 13.265c.053-.414.08-.837.08-1.265 0-5.523-4.477-10-10-10S2 6.477 2 12s4.477 10 10 10c.435 0 .864-.028 1.285-.082M12 6v6l3.738 1.87M19 22v-6m-3 3h6" />
    </svg>
);

export default ClockPlus;
