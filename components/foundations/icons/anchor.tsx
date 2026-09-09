import type { SVGProps } from "react";

interface Props extends SVGProps<SVGSVGElement> {
    color?: string;
    size?: number;
}

const Anchor = ({ size = 24, color = "currentColor", ...props }: Props) => (
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
        <path d="M12 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm0 0v14m0 0A10 10 0 0 1 2 12h3m7 10a10 10 0 0 0 10-10h-3" />
    </svg>
);

export default Anchor;
