import {
  Disclosure,
  DisclosureHeader,
  DisclosurePanel,
} from "@your-job-search-genius/odyssey-ui";

export default function DisclosureSingle() {
  return (
    <Disclosure style={{ maxWidth: 320 }}>
      <DisclosureHeader>System Requirements</DisclosureHeader>
      <DisclosurePanel>
        Requires a modern browser with JavaScript enabled. No additional
        plugins are needed.
      </DisclosurePanel>
    </Disclosure>
  );
}
