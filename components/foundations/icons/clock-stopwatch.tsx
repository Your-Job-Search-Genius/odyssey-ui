import type { SVGProps } from "react";

interface Props extends SVGProps<SVGSVGElement> {
    color?: string;
    size?: number;
}

const ClockStopwatch = ({ size = 24, color = "currentColor", ...props }: Props) => (
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
        <path d="M12 9.5v4l2.5 1.5M12 5a8.5 8.5 0 1 0 0 17 8.5 8.5 0 0 0 0-17Zm0 0V2m-2 0h4m6.329 3.592-1.5-1.5.75.75m-15.908.75 1.5-1.5-.75.75" />
    </svg>
);

export default ClockStopwatch;
