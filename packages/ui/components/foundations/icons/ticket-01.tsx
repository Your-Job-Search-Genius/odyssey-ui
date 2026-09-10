import type { SVGProps } from "react";

interface Props extends SVGProps<SVGSVGElement> {
    color?: string;
    size?: number;
}

const Ticket01 = ({ size = 24, color = "currentColor", ...props }: Props) => (
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
        <path d="M10 8V7m0 5.5v-1m0 5.5v-1M5.2 4h13.6c1.12 0 1.68 0 2.108.218a2 2 0 0 1 .874.874C22 5.52 22 6.08 22 7.2v1.3a3.5 3.5 0 1 0 0 7v1.3c0 1.12 0 1.68-.218 2.108a2 2 0 0 1-.874.874C20.48 20 19.92 20 18.8 20H5.2c-1.12 0-1.68 0-2.108-.218a2 2 0 0 1-.874-.874C2 18.48 2 17.92 2 16.8v-1.3a3.5 3.5 0 1 0 0-7V7.2c0-1.12 0-1.68.218-2.108a2 2 0 0 1 .874-.874C3.52 4 4.08 4 5.2 4Z" />
    </svg>
);

export default Ticket01;
