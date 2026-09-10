import type { SVGProps } from "react";

interface Props extends SVGProps<SVGSVGElement> {
    color?: string;
    size?: number;
}

const GridDotsRight = ({ size = 24, color = "currentColor", ...props }: Props) => (
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
        <path d="M7.5 3h.01m-.01 9h.01m-.01 9h.01M16.5 3h.01m-.01 9h.01m-.01 9h.01M12 3h.01M12 12h.01M12 21h.01M12 16.5h.01m-.01-9h.01M3 3h.01M3 12h.01M3 21h.01M3 16.5h.01M3 7.5h.01M21 21V3" />
    </svg>
);

export default GridDotsRight;
