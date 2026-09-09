import type { SVGProps } from "react";

interface Props extends SVGProps<SVGSVGElement> {
    size?: number;
    theme?: "light" | "dark";
}

const Spreadsheets = ({ size = 40, theme: _theme = "light", ...props }: Props) => {
    return (
        <svg width={size} height={size} fill="none" viewBox="0 0 40 40" aria-hidden="true" {...props}>
            <path fill="#079455" d="M4 4a4 4 0 0 1 4-4h16l12 12v24a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4z" />
            <path fill="#fff" d="m24 0 12 12h-8a4 4 0 0 1-4-4z" opacity={0.3} />
            <path
                stroke="#fff"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12.8 24.8h14.4m-14.4 0v-3.2a1.6 1.6 0 0 1 1.6-1.6h3.2m-4.8 4.8V28a1.6 1.6 0 0 0 1.6 1.6h3.2m9.6-4.8V28a1.6 1.6 0 0 1-1.6 1.6h-8m9.6-4.8v-3.2a1.6 1.6 0 0 0-1.6-1.6h-8m0 0v9.6"
            />
        </svg>
    );
};

export default Spreadsheets;
