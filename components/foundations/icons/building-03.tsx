import type { SVGProps } from "react";

interface Props extends SVGProps<SVGSVGElement> {
    color?: string;
    size?: number;
}

const Building03 = ({ size = 24, color = "currentColor", ...props }: Props) => (
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
        <path d="M7.5 7h2.75M7.5 11h2.75M7.5 15h2.75m3.5-8h2.75m-2.75 4h2.75m-2.75 4h2.75m3.5 6V6.2c0-1.12 0-1.68-.218-2.108a2 2 0 0 0-.874-.874C18.48 3 17.92 3 16.8 3H7.2c-1.12 0-1.68 0-2.108.218a2 2 0 0 0-.874.874C4 4.52 4 5.08 4 6.2V21m18 0H2" />
    </svg>
);

export default Building03;
