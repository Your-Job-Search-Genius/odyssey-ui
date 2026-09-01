import {
  Disclosure,
  DisclosureGroup,
  DisclosureHeader,
  DisclosurePanel,
} from "@your-job-search-genius/odyssey-ui";

export default function DisclosureGroupMultiple() {
  return (
    <DisclosureGroup
      style={{ maxWidth: 320 }}
      allowsMultipleExpanded
      defaultExpandedKeys={["settings", "advanced"]}
    >
      <Disclosure id="settings">
        <DisclosureHeader>Settings</DisclosureHeader>
        <DisclosurePanel>Application settings content.</DisclosurePanel>
      </Disclosure>
      <Disclosure id="preferences">
        <DisclosureHeader>Preferences</DisclosureHeader>
        <DisclosurePanel>User preferences content.</DisclosurePanel>
      </Disclosure>
      <Disclosure id="advanced">
        <DisclosureHeader>Advanced</DisclosureHeader>
        <DisclosurePanel>Advanced configuration options.</DisclosurePanel>
      </Disclosure>
    </DisclosureGroup>
  );
}
