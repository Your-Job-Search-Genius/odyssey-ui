import type { SVGProps } from "react";

interface Props extends SVGProps<SVGSVGElement> {
    color?: string;
    size?: number;
}

const ClockSnooze = ({ size = 24, color = "currentColor", ...props }: Props) => (
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
        <path d="M16.5 17h5l-5 5h5m.45-9c.033-.329.05-.662.05-1 0-5.523-4.477-10-10-10S2 6.477 2 12s4.477 10 10 10a10.11 10.11 0 0 0 1-.05M12 6v6l3.738 1.87" />
    </svg>
);

export default ClockSnooze;
