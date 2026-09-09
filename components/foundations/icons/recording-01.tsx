import type { SVGProps } from "react";

interface Props extends SVGProps<SVGSVGElement> {
    color?: string;
    size?: number;
}

const Recording01 = ({ size = 24, color = "currentColor", ...props }: Props) => (
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
        <path d="M3 10v4m4.5-8v12M12 3v18m4.5-15v12m4.5-8v4" />
    </svg>
);

export default Recording01;
