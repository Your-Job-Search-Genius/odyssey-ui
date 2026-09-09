import type { SVGProps } from "react";

interface Props extends SVGProps<SVGSVGElement> {
    color?: string;
    size?: number;
}

const UserCheck02 = ({ size = 24, color = "currentColor", ...props }: Props) => (
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
        <path d="M16 21v-1.2c0-1.68 0-2.52-.327-3.162a3 3 0 0 0-1.311-1.311C13.72 15 12.88 15 11.2 15H6.8c-1.68 0-2.52 0-3.162.327a3 3 0 0 0-1.311 1.311C2 17.28 2 18.12 2 19.8V21M16 6l2 2 4-4m-9.5 3.5a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z" />
    </svg>
);

export default UserCheck02;
