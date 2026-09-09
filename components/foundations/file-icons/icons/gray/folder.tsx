import type { SVGProps } from "react";

interface Props extends SVGProps<SVGSVGElement> {
    size?: number;
    theme?: "light" | "dark";
}

const Folder = ({ size = 40, theme = "light", ...props }: Props) => {
    return (
        <svg width={size} height={size} fill="none" viewBox="0 0 40 40" aria-hidden="true" {...props}>
            <mask id="folder_svg__b" width={32} height={40} x={4} y={0} maskUnits="userSpaceOnUse" style={{ maskType: "alpha" }}>
                <path fill="url(#folder_svg__a)" d="M4 4a4 4 0 0 1 4-4h16l12 12v24a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4z" />
            </mask>
            <g mask="url(#folder_svg__b)">
                <path fill={theme === "light" ? "#F5F5F5" : "#22262F"} d="M4 4a4 4 0 0 1 4-4h16l12 12v24a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4z" />
            </g>
            <path fill={theme === "light" ? "#E9EAEB" : "#373A41"} d="m24 0 12 12h-8a4 4 0 0 1-4-4z" />
            <path
                stroke={theme === "light" ? "#414651" : "#CECFD2"}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="m20.667 20.667-.744-1.488c-.214-.428-.321-.642-.48-.798a1.3 1.3 0 0 0-.499-.308c-.211-.073-.45-.073-.93-.073h-2.547c-.747 0-1.12 0-1.406.145-.25.128-.454.332-.582.583-.146.285-.146.659-.146 1.405v.534m0 0h10.134c1.12 0 1.68 0 2.108.218a2 2 0 0 1 .874.874c.218.427.218.988.218 2.108V26.8c0 1.12 0 1.68-.218 2.108a2 2 0 0 1-.874.874c-.428.218-.988.218-2.108.218h-6.934c-1.12 0-1.68 0-2.108-.218a2 2 0 0 1-.874-.874c-.218-.428-.218-.988-.218-2.108z"
            />
            <defs>
                <linearGradient id="folder_svg__a" x1={20} x2={20} y1={0} y2={40} gradientUnits="userSpaceOnUse">
                    <stop stopOpacity={0.4} />
                    <stop offset={1} />
                </linearGradient>
            </defs>
        </svg>
    );
};

export default Folder;
