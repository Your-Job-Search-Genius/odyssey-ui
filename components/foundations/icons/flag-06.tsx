import type { SVGProps } from "react";

interface Props extends SVGProps<SVGSVGElement> {
    color?: string;
    size?: number;
}

const Flag06 = ({ size = 24, color = "currentColor", ...props }: Props) => (
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
        <path d="M4 21V4m0 9h7.4c.56 0 .84 0 1.054-.109a1 1 0 0 0 .437-.437C13 12.24 13 11.96 13 11.4V4.6c0-.56 0-.84-.109-1.054a1 1 0 0 0-.437-.437C12.24 3 11.96 3 11.4 3H5.6c-.56 0-.84 0-1.054.109a1 1 0 0 0-.437.437C4 3.76 4 4.04 4 4.6V13Zm9-8h6.4c.56 0 .84 0 1.054.109a1 1 0 0 1 .437.437C21 5.76 21 6.04 21 6.6v6.8c0 .56 0 .84-.109 1.054a1 1 0 0 1-.437.437C20.24 15 19.96 15 19.4 15h-4.8c-.56 0-.84 0-1.054-.109a1 1 0 0 1-.437-.437C13 14.24 13 13.96 13 13.4V5Z" />
    </svg>
);

export default Flag06;
