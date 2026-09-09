import type { SVGProps } from "react";

interface Props extends SVGProps<SVGSVGElement> {
    color?: string;
    size?: number;
}

const Crop01 = ({ size = 24, color = "currentColor", ...props }: Props) => (
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
        <path d="M2 6h12.8c1.12 0 1.68 0 2.108.218a2 2 0 0 1 .874.874C18 7.52 18 8.08 18 9.2V22m4-4H9.2c-1.12 0-1.68 0-2.108-.218a2 2 0 0 1-.874-.874C6 16.48 6 15.92 6 14.8V2" />
    </svg>
);

export default Crop01;
