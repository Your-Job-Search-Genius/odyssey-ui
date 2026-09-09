import type { SVGProps } from "react";

interface Props extends SVGProps<SVGSVGElement> {
    color?: string;
    size?: number;
}

const Lightbulb01 = ({ size = 24, color = "currentColor", ...props }: Props) => (
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
        <path d="M15 16.5V19c0 .932 0 1.398-.152 1.765a2 2 0 0 1-1.083 1.083C13.398 22 12.932 22 12 22c-.932 0-1.398 0-1.765-.152a2 2 0 0 1-1.083-1.083C9 20.398 9 19.932 9 19v-2.5m6 0c2.649-1.157 4.5-3.925 4.5-7a7.5 7.5 0 0 0-15 0c0 3.075 1.851 5.843 4.5 7m6 0H9" />
    </svg>
);

export default Lightbulb01;
