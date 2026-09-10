import type { SVGProps } from "react";

interface Props extends SVGProps<SVGSVGElement> {
    size?: number;
    theme?: "light" | "dark";
}

const Image = ({ size = 40, theme: _theme = "light", ...props }: Props) => {
    return (
        <svg width={size} height={size} fill="none" viewBox="0 0 40 40" aria-hidden="true" {...props}>
            <path fill="#7F56D9" d="M4 4a4 4 0 0 1 4-4h16l12 12v24a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4z" />
            <path fill="#fff" d="m24 0 12 12h-8a4 4 0 0 1-4-4z" opacity={0.3} />
            <path
                stroke="#fff"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M24.667 30h.673c.648 0 .971 0 1.15-.135a.67.67 0 0 0 .263-.492c.013-.223-.166-.493-.525-1.031l-2.007-3.01c-.297-.446-.445-.668-.632-.746a.67.67 0 0 0-.511 0c-.187.078-.335.3-.632.745l-.496.745M24.667 30l-5.123-7.4c-.295-.426-.442-.638-.626-.713a.67.67 0 0 0-.502 0c-.184.075-.332.287-.626.713l-3.965 5.726c-.375.542-.563.813-.552 1.039a.67.67 0 0 0 .261.498c.18.137.509.137 1.168.137zM26 20a2 2 0 1 1-4 0 2 2 0 0 1 4 0"
            />
        </svg>
    );
};

export default Image;
