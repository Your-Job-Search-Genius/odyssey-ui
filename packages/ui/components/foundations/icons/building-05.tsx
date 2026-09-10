import type { SVGProps } from "react";

interface Props extends SVGProps<SVGSVGElement> {
    color?: string;
    size?: number;
}

const Building05 = ({ size = 24, color = "currentColor", ...props }: Props) => (
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
        <path d="M13 11h4.8c1.12 0 1.68 0 2.108.218a2 2 0 0 1 .874.874C21 12.52 21 13.08 21 14.2V21m-8 0V6.2c0-1.12 0-1.68-.218-2.108a2 2 0 0 0-.874-.874C11.48 3 10.92 3 9.8 3H6.2c-1.12 0-1.68 0-2.108.218a2 2 0 0 0-.874.874C3 4.52 3 5.08 3 6.2V21m19 0H2M6.5 7h3m-3 4h3m-3 4h3" />
    </svg>
);

export default Building05;
