import type { SVGProps } from "react";

interface Props extends SVGProps<SVGSVGElement> {
    color?: string;
    size?: number;
}

const Certificate01 = ({ size = 24, color = "currentColor", ...props }: Props) => (
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
        <path d="M6.5 20H5a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-1.5M12 19a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm0 0h.021L8.83 22.193 6 19.364l3.02-3.02M12 19l3.193 3.193 2.828-2.829-3.02-3.02M9 6h6M7 9.5h10" />
    </svg>
);

export default Certificate01;
