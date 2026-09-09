import type { SVGProps } from "react";

interface Props extends SVGProps<SVGSVGElement> {
    color?: string;
    size?: number;
}

const Compass = ({ size = 24, color = "currentColor", ...props }: Props) => (
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
        <path d="M12 4a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5Zm0 0V2m9 12.938A11.971 11.971 0 0 1 12 19a11.971 11.971 0 0 1-9-4.063m7.745-6.275L3 22M13.255 8.662 21 22" />
    </svg>
);

export default Compass;
