import type { SVGProps } from "react";

interface Props extends SVGProps<SVGSVGElement> {
    color?: string;
    size?: number;
}

const Lock04 = ({ size = 24, color = "currentColor", ...props }: Props) => (
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
        <path d="M7.101 10H7V8a5 5 0 0 1 10 0v2h-.101M12 14v2m7-1a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z" />
    </svg>
);

export default Lock04;
