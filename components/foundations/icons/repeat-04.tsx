import type { SVGProps } from "react";

interface Props extends SVGProps<SVGSVGElement> {
    color?: string;
    size?: number;
}

const Repeat04 = ({ size = 24, color = "currentColor", ...props }: Props) => (
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
        <path d="M12 20.5a8.5 8.5 0 0 0 5-15.375M13 22.4l-2-2 2-2M12 3.5a8.5 8.5 0 0 0-5 15.375M11 5.6l2-2-2-2" />
    </svg>
);

export default Repeat04;
