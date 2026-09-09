import type { SVGProps } from "react";

interface Props extends SVGProps<SVGSVGElement> {
    color?: string;
    size?: number;
}

const FlashOff = ({ size = 24, color = "currentColor", ...props }: Props) => (
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
        <path d="m8 8-3.907 4.688c-.348.418-.523.628-.525.804a.5.5 0 0 0 .185.397c.138.111.41.111.955.111H12l-1 8 5-6m-.35-6h3.642c.545 0 .817 0 .955.111a.5.5 0 0 1 .185.396c-.002.177-.177.387-.525.805L18.55 12.94m-7.977-8.027L13 2l-.6 4.798M21 21 3 3" />
    </svg>
);

export default FlashOff;
