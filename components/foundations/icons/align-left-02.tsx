import type { SVGProps } from "react";

interface Props extends SVGProps<SVGSVGElement> {
    color?: string;
    size?: number;
}

const AlignLeft02 = ({ size = 24, color = "currentColor", ...props }: Props) => (
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
        <path d="M14 10c.932 0 1.398 0 1.765-.152a2 2 0 0 0 1.083-1.083C17 8.398 17 7.932 17 7c0-.932 0-1.398-.152-1.765a2 2 0 0 0-1.083-1.083C15.398 4 14.932 4 14 4H6c-.932 0-1.398 0-1.765.152a2 2 0 0 0-1.083 1.083C3 5.602 3 6.068 3 7c0 .932 0 1.398.152 1.765a2 2 0 0 0 1.083 1.083C4.602 10 5.068 10 6 10h8Zm4 10c.932 0 1.398 0 1.765-.152a2 2 0 0 0 1.083-1.083C21 18.398 21 17.932 21 17c0-.932 0-1.398-.152-1.765a2 2 0 0 0-1.083-1.083C19.398 14 18.932 14 18 14H6c-.932 0-1.398 0-1.765.152a2 2 0 0 0-1.083 1.083C3 15.602 3 16.068 3 17c0 .932 0 1.398.152 1.765a2 2 0 0 0 1.083 1.083C4.602 20 5.068 20 6 20h12Z" />
    </svg>
);

export default AlignLeft02;
