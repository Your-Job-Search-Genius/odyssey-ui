import type { SVGProps } from "react";

interface Props extends SVGProps<SVGSVGElement> {
    color?: string;
    size?: number;
}

const Attachment02 = ({ size = 24, color = "currentColor", ...props }: Props) => (
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
        <path d="M17.5 5.256V16.5a5.5 5.5 0 1 1-11 0V5.667a3.667 3.667 0 0 1 7.333 0v10.779a1.833 1.833 0 1 1-3.666 0V6.65" />
    </svg>
);

export default Attachment02;
