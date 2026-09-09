import type { SVGProps } from "react";

interface Props extends SVGProps<SVGSVGElement> {
    color?: string;
    size?: number;
}

const Building06 = ({ size = 24, color = "currentColor", ...props }: Props) => (
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
        <path d="M11 11H6.2c-1.12 0-1.68 0-2.108.218a2 2 0 0 0-.874.874C3 12.52 3 13.08 3 14.2V21m18 0V6.2c0-1.12 0-1.68-.218-2.108a2 2 0 0 0-.874-.874C19.48 3 18.92 3 17.8 3h-3.6c-1.12 0-1.68 0-2.108.218a2 2 0 0 0-.874.874C11 4.52 11 5.08 11 6.2V21m11 0H2M14.5 7h3m-3 4h3m-3 4h3" />
    </svg>
);

export default Building06;
