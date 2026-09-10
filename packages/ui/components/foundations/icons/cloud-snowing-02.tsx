import type { SVGProps } from "react";

interface Props extends SVGProps<SVGSVGElement> {
    color?: string;
    size?: number;
}

const CloudSnowing02 = ({ size = 24, color = "currentColor", ...props }: Props) => (
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
        <path d="M8 18h.01M8 21h.01M12 18.5h.01m-.01 3h.01M16 18h.01M16 21h.01M7 15a5 5 0 1 1 .1-9.999 5.502 5.502 0 0 1 10.195 1.004A4.5 4.5 0 1 1 17.5 15H6.999Z" />
    </svg>
);

export default CloudSnowing02;
