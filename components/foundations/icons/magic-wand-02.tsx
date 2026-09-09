import type { SVGProps } from "react";

interface Props extends SVGProps<SVGSVGElement> {
    color?: string;
    size?: number;
}

const MagicWand02 = ({ size = 24, color = "currentColor", ...props }: Props) => (
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
        <path d="M15 4V2m0 14v-2M8 9h2m10 0h2m-4.2 2.8L19 13m-1.2-6.8L19 5M3 21l9-9m.2-5.8L11 5" />
    </svg>
);

export default MagicWand02;
