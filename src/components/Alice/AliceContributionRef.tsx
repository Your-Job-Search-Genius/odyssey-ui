import { forwardRef } from "react";
import type { HTMLAttributes, ReactNode } from "react";
import "./Alice.css";

export interface AliceContributionRefProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  children: ReactNode;
}

/**
 * A compact reference back to the resume line under discussion — Figma node
 * 469:1264, `Type=Contribution Ref`. Single-line; long contributions
 * truncate with an ellipsis, as the file shows.
 */
export const AliceContributionRef = forwardRef<HTMLDivElement, AliceContributionRefProps>(
  function AliceContributionRef({ children, className, ...rest }, ref) {
    return (
      <div ref={ref} className={["wsu-AliceContributionRef", className ?? ""].filter(Boolean).join(" ")} {...rest}>
        <p className="wsu-AliceContributionRef__text">{children}</p>
      </div>
    );
  },
);
