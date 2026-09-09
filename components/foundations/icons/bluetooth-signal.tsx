import type { SVGProps } from "react";

interface Props extends SVGProps<SVGSVGElement> {
    color?: string;
    size?: number;
}

const BluetoothSignal = ({ size = 24, color = "currentColor", ...props }: Props) => (
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
        <path d="m2 7 12 10-6 5V2l6 5L2 17M20.145 6.5a9.386 9.386 0 0 1 1.769 5.5 9.386 9.386 0 0 1-1.77 5.5M17 8.857A5.48 5.48 0 0 1 17.986 12 5.475 5.475 0 0 1 17 15.143" />
    </svg>
);

export default BluetoothSignal;
