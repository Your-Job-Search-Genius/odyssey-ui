import type { SVGProps } from "react";

interface Props extends SVGProps<SVGSVGElement> {
    color?: string;
    size?: number;
}

const Pentagon = ({ size = 24, color = "currentColor", ...props }: Props) => (
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
        <path d="M11.06 2.932c.338-.245.507-.368.692-.415a1 1 0 0 1 .497 0c.184.047.353.17.691.415l8.119 5.892c.338.246.507.368.61.53a1 1 0 0 1 .153.473c.012.19-.052.39-.182.787l-3.1 9.53c-.13.398-.194.597-.315.744a1 1 0 0 1-.403.292c-.177.07-.386.07-.803.07H6.982c-.418 0-.626 0-.804-.07a1 1 0 0 1-.402-.292c-.122-.147-.186-.346-.316-.743l-3.1-9.531c-.13-.398-.194-.597-.182-.787a1 1 0 0 1 .154-.473c.102-.162.272-.284.61-.53l8.118-5.892Z" />
    </svg>
);

export default Pentagon;
