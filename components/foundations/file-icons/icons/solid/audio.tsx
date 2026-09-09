import type { SVGProps } from "react";

interface Props extends SVGProps<SVGSVGElement> {
    size?: number;
    theme?: "light" | "dark";
}

const Audio = ({ size = 40, theme: _theme = "light", ...props }: Props) => {
    return (
        <svg width={size} height={size} fill="none" viewBox="0 0 40 40" aria-hidden="true" {...props}>
            <path fill="#DD2590" d="M4 4a4 4 0 0 1 4-4h16l12 12v24a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4z" />
            <path fill="#fff" d="m24 0 12 12h-8a4 4 0 0 1-4-4z" opacity={0.3} />
            <path
                stroke="#fff"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M17.2 28v-7.763c0-.321 0-.482.058-.612a.67.67 0 0 1 .24-.282c.118-.079.277-.105.593-.158l5.867-.978c.427-.071.64-.107.807-.045a.67.67 0 0 1 .347.293c.088.154.088.371.088.804v7.408M17.2 28a2 2 0 1 1-4 0 2 2 0 0 1 4 0m8-1.333a2 2 0 1 1-4 0 2 2 0 0 1 4 0"
            />
        </svg>
    );
};

export default Audio;
