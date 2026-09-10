import type { SVGProps } from "react";

interface Props extends SVGProps<SVGSVGElement> {
    color?: string;
    size?: number;
}

const ChartBreakoutCircle = ({ size = 24, color = "currentColor", ...props }: Props) => (
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
        <path d="M15.5 3.5V2m3.94 2.56L20.5 3.5m.01 5h1.5m-.06 4.5c-.501 5.053-4.765 9-9.95 9-5.523 0-10-4.477-10-10 0-5.185 3.947-9.449 9-9.95M12 8h4v4m-.38-4A12.984 12.984 0 0 1 5 13.5c-1.003 0-1.98-.114-2.917-.329" />
    </svg>
);

export default ChartBreakoutCircle;
