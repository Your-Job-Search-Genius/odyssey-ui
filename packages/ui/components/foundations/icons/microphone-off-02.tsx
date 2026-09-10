import type { SVGProps } from "react";

interface Props extends SVGProps<SVGSVGElement> {
    color?: string;
    size?: number;
}

const MicrophoneOff02 = ({ size = 24, color = "currentColor", ...props }: Props) => (
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
        <path d="M4 12v1a8 8 0 0 0 14.138 5.132M2 2l20 20m-6-11.6V7a4 4 0 0 0-6.53-3.1M12 17a4 4 0 0 1-4-4V8l7.281 7.288A3.995 3.995 0 0 1 12 17Z" />
    </svg>
);

export default MicrophoneOff02;
