import {
  Disclosure,
  DisclosureHeader,
  DisclosurePanel,
} from "@your-job-search-genius/odyssey-ui";

export default function DisclosureDefaultExpanded() {
  return (
    <Disclosure defaultExpanded style={{ maxWidth: 320 }}>
      <DisclosureHeader>Billing Address</DisclosureHeader>
      <DisclosurePanel>123 Main St, Springfield, USA</DisclosurePanel>
    </Disclosure>
  );
}
