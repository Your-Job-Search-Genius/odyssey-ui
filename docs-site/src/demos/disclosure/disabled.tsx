import {
  Disclosure,
  DisclosureHeader,
  DisclosurePanel,
} from "@your-job-search-genius/odyssey-ui";

export default function DisclosureDisabled() {
  return (
    <Disclosure disabled style={{ maxWidth: 320 }}>
      <DisclosureHeader>Locked Section</DisclosureHeader>
      <DisclosurePanel>This content is unavailable.</DisclosurePanel>
    </Disclosure>
  );
}
