import type { SVGProps } from "react";

interface Props extends SVGProps<SVGSVGElement> {
    size?: number;
    theme?: "light" | "dark";
}

const Ai = ({ size = 40, theme: _theme = "light", ...props }: Props) => {
    return (
        <svg width={size} height={size} fill="none" viewBox="0 0 40 40" aria-hidden="true" {...props}>
            <path fill="#E04F16" d="M4 4a4 4 0 0 1 4-4h16l12 12v24a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4z" />
            <path fill="#fff" d="m24 0 12 12h-8a4 4 0 0 1-4-4z" opacity={0.3} />
            <path
                fill="#fff"
                d="M17.07 32h-1.483l2.26-6.546h1.783L21.886 32h-1.483l-1.64-5.05h-.05zm-.093-2.573h3.503v1.08h-3.503zm7.08-3.972V32h-1.383v-6.546z"
            />
        </svg>
    );
};

export default Ai;
