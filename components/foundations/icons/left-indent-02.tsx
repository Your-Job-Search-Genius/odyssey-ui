import type { SVGProps } from "react";

interface Props extends SVGProps<SVGSVGElement> {
    color?: string;
    size?: number;
}

const LeftIndent02 = ({ size = 24, color = "currentColor", ...props }: Props) => (
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
        <path d="M21 9.25h-9M21 4h-9m9 10.75H3M21 20H3M4.28 2.96l3.867 2.9c.29.217.434.326.486.459a.5.5 0 0 1 0 .362c-.052.133-.197.242-.486.459l-3.867 2.9c-.412.309-.618.463-.79.46a.5.5 0 0 1-.384-.192C3 10.172 3 9.915 3 9.4V3.6c0-.515 0-.773.106-.908A.5.5 0 0 1 3.49 2.5c.172-.004.378.151.79.46Z" />
    </svg>
);

export default LeftIndent02;
