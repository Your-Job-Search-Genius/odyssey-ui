import type { SVGProps } from "react";

interface Props extends SVGProps<SVGSVGElement> {
    color?: string;
    size?: number;
}

const GitPullRequest = ({ size = 24, color = "currentColor", ...props }: Props) => (
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
        <path d="M18 15a3 3 0 1 0 0 6 3 3 0 0 0 0-6Zm0 0V8a2 2 0 0 0-2-2h-3M6 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm0 0v12" />
    </svg>
);

export default GitPullRequest;
