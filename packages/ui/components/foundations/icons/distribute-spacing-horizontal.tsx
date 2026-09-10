import type { SVGProps } from "react";

interface Props extends SVGProps<SVGSVGElement> {
    color?: string;
    size?: number;
}

const DistributeSpacingHorizontal = ({ size = 24, color = "currentColor", ...props }: Props) => (
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
        <path d="M21 21V3M3 21V3m6 5v8c0 .932 0 1.398.152 1.765a2 2 0 0 0 1.083 1.083C10.602 19 11.068 19 12 19c.932 0 1.398 0 1.765-.152a2 2 0 0 0 1.083-1.083C15 17.398 15 16.932 15 16V8c0-.932 0-1.398-.152-1.765a2 2 0 0 0-1.083-1.083C13.398 5 12.932 5 12 5c-.932 0-1.398 0-1.765.152a2 2 0 0 0-1.083 1.083C9 6.602 9 7.068 9 8Z" />
    </svg>
);

export default DistributeSpacingHorizontal;
