import type { SVGProps } from "react";

interface Props extends SVGProps<SVGSVGElement> {
    color?: string;
    size?: number;
}

const Signal01 = ({ size = 24, color = "currentColor", ...props }: Props) => (
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
        <path d="M16.243 7.757a6 6 0 0 1 0 8.486m-8.486 0a6 6 0 0 1 0-8.486M4.93 19.071c-3.905-3.905-3.905-10.237 0-14.142m14.142 0c3.905 3.905 3.905 10.237 0 14.142M14 12a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z" />
    </svg>
);

export default Signal01;
