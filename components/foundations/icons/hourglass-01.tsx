import type { SVGProps } from "react";

interface Props extends SVGProps<SVGSVGElement> {
    color?: string;
    size?: number;
}

const Hourglass01 = ({ size = 24, color = "currentColor", ...props }: Props) => (
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
        <path d="M12 12 7.727 8.44c-.635-.53-.952-.794-1.18-1.119a3 3 0 0 1-.444-.947C6 5.991 6 5.578 6 4.752V2m6 10 4.273-3.56c.635-.53.952-.794 1.18-1.119a3 3 0 0 0 .444-.947C18 5.991 18 5.578 18 4.752V2m-6 10-4.273 3.56c-.635.53-.952.794-1.18 1.119a3 3 0 0 0-.444.947C6 18.009 6 18.422 6 19.248V22m6-10 4.273 3.56c.635.53.952.794 1.18 1.119a3 3 0 0 1 .444.947c.103.383.103.796.103 1.622V22M4 2h16M4 22h16" />
    </svg>
);

export default Hourglass01;
