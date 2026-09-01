import { Breadcrumb, Breadcrumbs } from "@your-job-search-genius/odyssey-ui";

export default function BreadcrumbsDisabledCrumb() {
  return (
    <Breadcrumbs>
      <Breadcrumb href="#">Home</Breadcrumb>
      <Breadcrumb href="#" isDisabled>
        Archived
      </Breadcrumb>
      <Breadcrumb>Current</Breadcrumb>
    </Breadcrumbs>
  );
}
