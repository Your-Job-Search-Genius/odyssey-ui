import type { SVGProps } from "react";

interface Props extends SVGProps<SVGSVGElement> {
    color?: string;
    size?: number;
}

const Voicemail = ({ size = 24, color = "currentColor", ...props }: Props) => (
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
        <path d="M6 16h12M6 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm12 0a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" />
    </svg>
);

export default Voicemail;
