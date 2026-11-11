import type { SVGProps } from "react";

export const HelpCircleIcon = (props: SVGProps<SVGSVGElement>) => (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true" {...props}>
        <circle cx="9" cy="9" r="7.5" stroke="currentColor" strokeWidth="1.40625" />
        <path
            d="M7.5 6.75C7.5 5.92157 8.17157 5.25 9 5.25C9.82843 5.25 10.5 5.92157 10.5 6.75C10.5 7.04861 10.4127 7.32685 10.2623 7.56059C9.81405 8.25725 9 8.92157 9 9.75V10.125"
            stroke="currentColor"
            strokeWidth="1.40625"
            strokeLinecap="round"
        />
        <path d="M8.994 12.75H9.00073" stroke="currentColor" strokeWidth="1.875" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);
