import type { SVGProps } from "react";

interface Props extends SVGProps<SVGSVGElement> {
    color?: string;
    size?: number;
}

const GlobeSlated01 = ({ size = 24, color = "currentColor", ...props }: Props) => (
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
        <path d="M18.632 2.368c4.49 4.491 4.49 11.773 0 16.264-4.301 4.3-11.161 4.483-15.679.546-.197-.172-.295-.258-.34-.375a.521.521 0 0 1-.01-.322c.036-.12.134-.218.33-.415L5.15 15.85M18 10.5a7.5 7.5 0 1 1-15 0 7.5 7.5 0 0 1 15 0Z" />
    </svg>
);

export default GlobeSlated01;
