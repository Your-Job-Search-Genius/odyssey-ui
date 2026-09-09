import type { SVGProps } from "react";

interface Props extends SVGProps<SVGSVGElement> {
    color?: string;
    size?: number;
}

const NavigationPointer02 = ({ size = 24, color = "currentColor", ...props }: Props) => (
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
        <path d="M5.037 21.325c-.585.258-.877.386-1.057.33a.5.5 0 0 1-.326-.327c-.057-.179.071-.471.328-1.056L11.263 3.67c.232-.528.348-.792.51-.873a.5.5 0 0 1 .446 0c.162.081.278.345.51.873l7.281 16.602c.257.585.385.877.328 1.056a.5.5 0 0 1-.326.327c-.18.056-.472-.072-1.057-.33l-6.637-2.92a1.111 1.111 0 0 0-.24-.089.497.497 0 0 0-.164 0c-.062.01-.121.037-.24.089l-6.637 2.92Z" />
    </svg>
);

export default NavigationPointer02;
