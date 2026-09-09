import type { SVGProps } from "react";

interface Props extends SVGProps<SVGSVGElement> {
    color?: string;
    size?: number;
}

const Send03 = ({ size = 24, color = "currentColor", ...props }: Props) => (
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
        <path d="M10.5 12H5m-.084.291L2.58 19.267c-.184.548-.275.822-.21.99a.5.5 0 0 0 .332.3c.174.05.438-.07.965-.306l16.711-7.52c.515-.232.772-.348.851-.508a.5.5 0 0 0 0-.444c-.08-.16-.336-.276-.85-.508L3.661 3.748c-.525-.237-.788-.355-.962-.306a.5.5 0 0 0-.332.299c-.066.168.025.442.206.988l2.342 7.057c.032.094.047.14.053.188a.5.5 0 0 1 0 .129c-.006.048-.022.095-.053.188Z" />
    </svg>
);

export default Send03;
