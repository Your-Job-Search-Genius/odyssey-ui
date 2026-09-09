import type { SVGProps } from "react";

interface Props extends SVGProps<SVGSVGElement> {
    color?: string;
    size?: number;
}

const Columns01 = ({ size = 24, color = "currentColor", ...props }: Props) => (
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
        <path d="M6.8 3h-.6c-1.12 0-1.68 0-2.108.218a2 2 0 0 0-.874.874C3 4.52 3 5.08 3 6.2v11.6c0 1.12 0 1.68.218 2.108a2 2 0 0 0 .874.874C4.52 21 5.08 21 6.2 21h.6c1.12 0 1.68 0 2.108-.218a2 2 0 0 0 .874-.874C10 19.48 10 18.92 10 17.8V6.2c0-1.12 0-1.68-.218-2.108a2 2 0 0 0-.874-.874C8.48 3 7.92 3 6.8 3Zm11 0h-.6c-1.12 0-1.68 0-2.108.218a2 2 0 0 0-.874.874C14 4.52 14 5.08 14 6.2v11.6c0 1.12 0 1.68.218 2.108a2 2 0 0 0 .874.874C15.52 21 16.08 21 17.2 21h.6c1.12 0 1.68 0 2.108-.218a2 2 0 0 0 .874-.874C21 19.48 21 18.92 21 17.8V6.2c0-1.12 0-1.68-.218-2.108a2 2 0 0 0-.874-.874C19.48 3 18.92 3 17.8 3Z" />
    </svg>
);

export default Columns01;
