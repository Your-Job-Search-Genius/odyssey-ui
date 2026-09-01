import { Breadcrumb, Breadcrumbs } from "@your-job-search-genius/odyssey-ui";

export default function BreadcrumbsAllDisabled() {
  return (
    <Breadcrumbs isDisabled>
      <Breadcrumb href="#">Home</Breadcrumb>
      <Breadcrumb href="#">React Aria</Breadcrumb>
      <Breadcrumb>Breadcrumbs</Breadcrumb>
    </Breadcrumbs>
  );
}
