import type { SVGProps } from "react";

interface Props extends SVGProps<SVGSVGElement> {
    color?: string;
    size?: number;
}

const DownloadCloud01 = ({ size = 24, color = "currentColor", ...props }: Props) => (
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
        <path d="M4 16.242A4.5 4.5 0 0 1 6.08 8.02a6.002 6.002 0 0 1 11.84 0A4.5 4.5 0 0 1 20 16.242M8 17l4 4m0 0 4-4m-4 4v-9" />
    </svg>
);

export default DownloadCloud01;
