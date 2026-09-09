import type { SVGProps } from "react";

interface Props extends SVGProps<SVGSVGElement> {
    color?: string;
    size?: number;
}

const ArrowBlockLeft = ({ size = 24, color = "currentColor", ...props }: Props) => (
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
        <path d="m3 12 7-7v4h10.2c.28 0 .42 0 .527.055a.5.5 0 0 1 .218.218C21 9.38 21 9.52 21 9.8v4.4c0 .28 0 .42-.055.527a.5.5 0 0 1-.218.218C20.62 15 20.48 15 20.2 15H10v4l-7-7Z" />
    </svg>
);

export default ArrowBlockLeft;
