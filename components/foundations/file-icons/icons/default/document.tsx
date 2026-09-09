import type { SVGProps } from "react";

interface Props extends SVGProps<SVGSVGElement> {
    size?: number;
    theme?: "light" | "dark";
}

const Document = ({ size = 40, theme = "light", ...props }: Props) => {
    return (
        <svg width={size} height={size} fill="none" viewBox="0 0 40 40" aria-hidden="true" {...props}>
            <path
                stroke={theme === "light" ? "#D5D7DA" : "#373A41"}
                strokeWidth={1.5}
                d="M4.75 4A3.25 3.25 0 0 1 8 .75h16c.121 0 .238.048.323.134l10.793 10.793a.46.46 0 0 1 .134.323v24A3.25 3.25 0 0 1 32 39.25H8A3.25 3.25 0 0 1 4.75 36z"
            />
            <path stroke={theme === "light" ? "#D5D7DA" : "#373A41"} strokeWidth={1.5} d="M24 .5V8a4 4 0 0 0 4 4h7.5" />
            <path
                stroke={theme === "light" ? "#155EEF" : "#528BFF"}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M11.9 19.5h16.2m-16.2 3.6h16.2m-16.2 3.6h16.2m-16.2 3.6h12.6"
            />
        </svg>
    );
};

export default Document;
