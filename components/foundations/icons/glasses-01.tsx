import type { SVGProps } from "react";

interface Props extends SVGProps<SVGSVGElement> {
    color?: string;
    size?: number;
}

const Glasses01 = ({ size = 24, color = "currentColor", ...props }: Props) => (
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
        <path d="M10 11.535a4.008 4.008 0 0 1 4 0M8.828 9.172a4 4 0 1 1-5.657 5.656 4 4 0 0 1 5.657-5.656Zm12 0a4 4 0 1 1-5.656 5.656 4 4 0 0 1 5.656-5.656Z" />
    </svg>
);

export default Glasses01;
