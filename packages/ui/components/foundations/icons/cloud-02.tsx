import type { SVGProps } from "react";

interface Props extends SVGProps<SVGSVGElement> {
    color?: string;
    size?: number;
}

const Cloud02 = ({ size = 24, color = "currentColor", ...props }: Props) => (
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
        <path d="M6 19a4 4 0 0 1-.999-7.874L5 11a7 7 0 0 1 13.96-.758A4.502 4.502 0 0 1 17.5 19H6Z" />
    </svg>
);

export default Cloud02;
