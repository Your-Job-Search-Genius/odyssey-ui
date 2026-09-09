import type { SVGProps } from "react";

interface Props extends SVGProps<SVGSVGElement> {
    color?: string;
    size?: number;
}

const Atom01 = ({ size = 24, color = "currentColor", ...props }: Props) => (
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
        <path d="M12 12h.01m3.525 3.536c-4.686 4.686-10.068 6.902-12.02 4.95-1.953-1.953.263-7.335 4.949-12.021 4.686-4.687 10.068-6.903 12.02-4.95 1.953 1.952-.263 7.334-4.949 12.02Zm0-7.072c4.686 4.687 6.902 10.069 4.95 12.021-1.953 1.953-7.335-.263-12.021-4.95-4.686-4.686-6.902-10.068-4.95-12.02 1.953-1.953 7.335.263 12.021 4.95ZM12.499 12a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0Z" />
    </svg>
);

export default Atom01;
