import {
  Breadcrumbs as AriaBreadcrumbs,
  Breadcrumb as AriaBreadcrumb,
  Link,
} from "react-aria-components";
import type { BreadcrumbsProps, BreadcrumbProps, LinkProps } from "react-aria-components";
import { ArrowRight01SharpIcon } from "@your-job-search-genius/icons";
import "./Breadcrumbs.css";

export type { BreadcrumbsProps };

export function Breadcrumbs<T extends object>({ className, ...props }: BreadcrumbsProps<T>) {
  return <AriaBreadcrumbs {...props} className={className ? `wsu-Breadcrumbs ${className}` : "wsu-Breadcrumbs"} />;
}

export type BreadcrumbLinkProps = BreadcrumbProps & Omit<LinkProps, "className">;

/**
 * A single crumb — built on `react-aria-components`' `Breadcrumb`/`Link`.
 * `Breadcrumb` computes `isCurrent` from its position (last item) and hands
 * `aria-current`/`isDisabled`/`onPress` down to the nested `Link` via
 * context; an explicit `isDisabled`/`onPress`/etc. passed here still wins
 * (context merges first, local props second — mirrors the RAC docs' vanilla
 * example). The current crumb is always non-interactive, and `Breadcrumbs`'
 * own `isDisabled` disables every crumb in the trail at once.
 */
export function Breadcrumb(props: BreadcrumbLinkProps) {
  return (
    <AriaBreadcrumb {...props} className="wsu-Breadcrumb">
      {({ isCurrent }) => (
        <>
          <Link {...props} className="wsu-Breadcrumb__link" />
          {!isCurrent && <ArrowRight01SharpIcon size="0.75rem" className="wsu-Breadcrumb__separator" />}
        </>
      )}
    </AriaBreadcrumb>
  );
}
