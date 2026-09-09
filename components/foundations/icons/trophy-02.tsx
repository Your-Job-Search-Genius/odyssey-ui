import type { SVGProps } from "react";

interface Props extends SVGProps<SVGSVGElement> {
    color?: string;
    size?: number;
}

const Trophy02 = ({ size = 24, color = "currentColor", ...props }: Props) => (
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
        <path d="M12 17a6.5 6.5 0 0 1-6.5-6.5V4.556c0-.519 0-.778.094-.979a1 1 0 0 1 .483-.483C6.278 3 6.537 3 7.056 3h9.888c.519 0 .778 0 .979.094a1 1 0 0 1 .483.483c.094.201.094.46.094.979V10.5A6.5 6.5 0 0 1 12 17Zm0 0v4m5 0H7M22 5v5M2 5v5" />
    </svg>
);

export default Trophy02;
