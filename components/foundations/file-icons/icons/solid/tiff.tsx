import type { SVGProps } from "react";

interface Props extends SVGProps<SVGSVGElement> {
    size?: number;
    theme?: "light" | "dark";
}

const Tiff = ({ size = 40, theme: _theme = "light", ...props }: Props) => {
    return (
        <svg width={size} height={size} fill="none" viewBox="0 0 40 40" aria-hidden="true" {...props}>
            <path fill="#7F56D9" d="M4 4a4 4 0 0 1 4-4h16l12 12v24a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4z" />
            <path fill="#fff" d="m24 0 12 12h-8a4 4 0 0 1-4-4z" opacity={0.3} />
            <path
                fill="#fff"
                d="M10.788 26.596v-1.142h5.376v1.142H14.16V32h-1.368v-5.404zm7.645-1.142V32h-1.384v-6.546zM19.57 32v-6.546h4.334v1.142h-2.95v1.56h2.663v1.14h-2.663V32zm5.265 0v-6.546h4.334v1.142h-2.95v1.56h2.662v1.14H26.22V32z"
            />
        </svg>
    );
};

export default Tiff;
