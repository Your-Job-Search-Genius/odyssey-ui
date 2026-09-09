import type { SVGProps } from "react";

interface Props extends SVGProps<SVGSVGElement> {
    color?: string;
    size?: number;
}

const Snowflake02 = ({ size = 24, color = "currentColor", ...props }: Props) => (
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
        <path d="M12 8v8m0-8V2m0 6L7 3m5 5 5-5m-5 13v6m0-6-5 5m5-5 5 5m-1-9H8m8 0h6m-6 0 5-5m-5 5 5 5M8 12H2m6 0L3 7m5 5-5 5" />
    </svg>
);

export default Snowflake02;
