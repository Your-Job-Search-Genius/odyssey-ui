import type { SVGProps } from "react";

interface Props extends SVGProps<SVGSVGElement> {
    color?: string;
    size?: number;
}

const GitMerge = ({ size = 24, color = "currentColor", ...props }: Props) => (
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
        <path d="M15 18a3 3 0 1 0 6 0 3 3 0 0 0-6 0Zm0 0a9 9 0 0 1-9-9m0 0a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm0 0v12" />
    </svg>
);

export default GitMerge;
