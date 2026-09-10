import type { SVGProps } from "react";

interface Props extends SVGProps<SVGSVGElement> {
    color?: string;
    size?: number;
}

const Airplay = ({ size = 24, color = "currentColor", ...props }: Props) => (
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
        <path d="M5 18a3 3 0 0 1-3-3V7.8c0-1.68 0-2.52.327-3.162a3 3 0 0 1 1.311-1.311C4.28 3 5.12 3 6.8 3h10.4c1.68 0 2.52 0 3.162.327a3 3 0 0 1 1.311 1.311C22 5.28 22 6.12 22 7.8V15a3 3 0 0 1-3 3M8.708 21h6.584c.545 0 .817 0 .955-.111a.5.5 0 0 0 .185-.396c-.002-.177-.177-.387-.525-.805l-3.292-3.95c-.212-.254-.317-.38-.443-.427a.5.5 0 0 0-.344 0c-.126.047-.231.173-.443.427l-3.292 3.95c-.348.418-.523.628-.525.805a.5.5 0 0 0 .185.396c.138.111.41.111.955.111Z" />
    </svg>
);

export default Airplay;
