import type { SVGProps } from "react";

interface Props extends SVGProps<SVGSVGElement> {
    color?: string;
    size?: number;
}

const DistributeSpacingVertical = ({ size = 24, color = "currentColor", ...props }: Props) => (
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
        <path d="M21 3H3m18 18H3m2-9c0-.932 0-1.398.152-1.765a2 2 0 0 1 1.083-1.083C6.602 9 7.068 9 8 9h8c.932 0 1.398 0 1.765.152a2 2 0 0 1 1.083 1.083C19 10.602 19 11.068 19 12c0 .932 0 1.398-.152 1.765a2 2 0 0 1-1.083 1.083C17.398 15 16.932 15 16 15H8c-.932 0-1.398 0-1.765-.152a2 2 0 0 1-1.083-1.083C5 13.398 5 12.932 5 12Z" />
    </svg>
);

export default DistributeSpacingVertical;
