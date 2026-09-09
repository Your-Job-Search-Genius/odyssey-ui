import type { SVGProps } from "react";

interface Props extends SVGProps<SVGSVGElement> {
    color?: string;
    size?: number;
}

const AlignHorizontalCentre01 = ({ size = 24, color = "currentColor", ...props }: Props) => (
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
        <path d="M12 3v18m10-9h-6.5m0 0 4 4m-4-4 4-4M2 12h6.5m0 0-4 4m4-4-4-4" />
    </svg>
);

export default AlignHorizontalCentre01;
