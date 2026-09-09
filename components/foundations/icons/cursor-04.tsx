import type { SVGProps } from "react";

interface Props extends SVGProps<SVGSVGElement> {
    color?: string;
    size?: number;
}

const Cursor04 = ({ size = 24, color = "currentColor", ...props }: Props) => (
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
        <path d="M4.407 3.414c-.458-.135-.687-.202-.843-.144a.5.5 0 0 0-.294.294c-.058.156.009.385.144.843l4.206 14.3c.125.426.188.64.314.738a.5.5 0 0 0 .39.1c.158-.027.315-.184.629-.498L12 16l4.434 4.434c.198.198.297.297.411.335a.5.5 0 0 0 .31 0c.114-.037.213-.136.41-.334l2.87-2.87c.197-.197.296-.296.333-.41a.5.5 0 0 0 0-.31c-.037-.113-.136-.212-.334-.41L16 12l3.047-3.047c.314-.314.47-.47.497-.629a.5.5 0 0 0-.1-.39c-.098-.126-.311-.189-.737-.314l-14.3-4.206Z" />
    </svg>
);

export default Cursor04;
