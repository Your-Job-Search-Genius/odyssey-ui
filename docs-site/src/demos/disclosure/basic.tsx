import { Disclosure, DisclosureGroup, DisclosureHeader, DisclosurePanel } from "@your-job-search-genius/odyssey-ui";

export default function DisclosureBasic() {
  return (
    <DisclosureGroup style={{ maxWidth: 320 }} defaultExpandedKeys={["personal"]}>
      <Disclosure id="personal">
        <DisclosureHeader>Personal Information</DisclosureHeader>
        <DisclosurePanel>Personal information form here.</DisclosurePanel>
      </Disclosure>
      <Disclosure id="billing">
        <DisclosureHeader>Billing Address</DisclosureHeader>
        <DisclosurePanel>123 Main St, Springfield, USA</DisclosurePanel>
      </Disclosure>
      <Disclosure id="shipping">
        <DisclosureHeader>Shipping Address</DisclosureHeader>
        <DisclosurePanel>Same as billing, or enter a different address.</DisclosurePanel>
      </Disclosure>
    </DisclosureGroup>
  );
}
