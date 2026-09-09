import type { SVGProps } from "react";

interface Props extends SVGProps<SVGSVGElement> {
    color?: string;
    size?: number;
}

const Beaker01 = ({ size = 24, color = "currentColor", ...props }: Props) => (
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
        <path d="M10 2v4.66c0 .218 0 .326-.033.413a.47.47 0 0 1-.138.198c-.07.06-.183.102-.409.185a7.5 7.5 0 1 0 5.16 0c-.226-.083-.339-.125-.409-.185a.469.469 0 0 1-.138-.198C14 6.986 14 6.878 14 6.66V2M8.5 2h7" />
    </svg>
);

export default Beaker01;
