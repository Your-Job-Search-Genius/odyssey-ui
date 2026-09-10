import type { SVGProps } from "react";

interface Props extends SVGProps<SVGSVGElement> {
    color?: string;
    size?: number;
}

const AlignTopArrow02 = ({ size = 24, color = "currentColor", ...props }: Props) => (
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
        <path d="M10 18V6c0-.932 0-1.398-.152-1.765a2 2 0 0 0-1.083-1.083C8.398 3 7.932 3 7 3c-.932 0-1.398 0-1.765.152a2 2 0 0 0-1.083 1.083C4 4.602 4 5.068 4 6v12c0 .932 0 1.398.152 1.765a2 2 0 0 0 1.083 1.083C5.602 21 6.068 21 7 21c.932 0 1.398 0 1.765-.152a2 2 0 0 0 1.083-1.083C10 19.398 10 18.932 10 18Zm10-4V6c0-.932 0-1.398-.152-1.765a2 2 0 0 0-1.083-1.083C18.398 3 17.932 3 17 3c-.932 0-1.398 0-1.765.152a2 2 0 0 0-1.083 1.083C14 4.602 14 5.068 14 6v8c0 .932 0 1.398.152 1.765a2 2 0 0 0 1.083 1.083C15.602 17 16.068 17 17 17c.932 0 1.398 0 1.765-.152a2 2 0 0 0 1.083-1.083C20 15.398 20 14.932 20 14Z" />
    </svg>
);

export default AlignTopArrow02;
