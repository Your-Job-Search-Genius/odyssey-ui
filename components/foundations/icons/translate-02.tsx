import type { SVGProps } from "react";

interface Props extends SVGProps<SVGSVGElement> {
    color?: string;
    size?: number;
}

const Translate02 = ({ size = 24, color = "currentColor", ...props }: Props) => (
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
        <path d="m5 8 5 5m-6 1 6-6 2-3M2 5h12M7 2h1m4.913 15h7.174m-7.174 0L11 21m1.913-4 2.865-5.991c.231-.483.347-.724.505-.8a.5.5 0 0 1 .434 0c.158.076.274.317.505.8L20.087 17m0 0L22 21" />
    </svg>
);

export default Translate02;
