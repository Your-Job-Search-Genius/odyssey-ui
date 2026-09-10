import type { SVGProps } from "react";

interface Props extends SVGProps<SVGSVGElement> {
    color?: string;
    size?: number;
}

const Umbrella01 = ({ size = 24, color = "currentColor", ...props }: Props) => (
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
        <path d="M17 19.4c0 1.436-1.12 2.6-2.5 2.6S12 20.836 12 19.4V12m-9.874-1.594C2.89 5.641 7.02 2 12 2s9.11 3.64 9.874 8.406c.074.465.111.698.018.946a1.097 1.097 0 0 1-.44.516c-.23.132-.504.132-1.052.132H3.6c-.548 0-.821 0-1.052-.132a1.097 1.097 0 0 1-.44-.516c-.093-.248-.056-.48.018-.946Z" />
    </svg>
);

export default Umbrella01;
