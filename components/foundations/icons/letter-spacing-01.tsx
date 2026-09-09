import type { SVGProps } from "react";

interface Props extends SVGProps<SVGSVGElement> {
    color?: string;
    size?: number;
}

const LetterSpacing01 = ({ size = 24, color = "currentColor", ...props }: Props) => (
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
        <path d="M9 13h6m-8 4 4.272-9.398c.231-.509.347-.763.507-.842a.5.5 0 0 1 .442 0c.16.079.276.333.507.842L17 17m4-14v18M3 3v18" />
    </svg>
);

export default LetterSpacing01;
