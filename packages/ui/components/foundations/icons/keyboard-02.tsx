import type { SVGProps } from "react";

interface Props extends SVGProps<SVGSVGElement> {
    color?: string;
    size?: number;
}

const Keyboard02 = ({ size = 24, color = "currentColor", ...props }: Props) => (
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
        <path d="M7 14.5h10M6 10h.01M10 10h.01M14 10h.01M18 10h.01M5.2 18h13.6c1.12 0 1.68 0 2.108-.218a2 2 0 0 0 .874-.874C22 16.48 22 15.92 22 14.8V9.2c0-1.12 0-1.68-.218-2.108a2 2 0 0 0-.874-.874C20.48 6 19.92 6 18.8 6H5.2c-1.12 0-1.68 0-2.108.218a2 2 0 0 0-.874.874C2 7.52 2 8.08 2 9.2v5.6c0 1.12 0 1.68.218 2.108a2 2 0 0 0 .874.874C3.52 18 4.08 18 5.2 18Z" />
    </svg>
);

export default Keyboard02;
